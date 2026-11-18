import json
import asyncio
import time
import httpx
from app.config import get_settings


class AINotConfiguredError(Exception):
    """Exceção lançada quando a chave ou o modelo da IA não estão configurados."""
    pass


class AIServiceError(Exception):
    """Exceção lançada quando ocorre uma falha na comunicação ou resposta da IA."""
    pass


def _sync_chat_request(url: str, payload: dict, headers: dict) -> dict:
    """
    Executa a requisição HTTP de forma síncrona com mecanismo de retry 
    para contornar oscilações temporárias de servidor (status 503 / 429).
    """
    max_retries = 3
    retry_delay = 2.0  # segundos de espera entre tentativas

    for attempt in range(1, max_retries + 1):
        with httpx.Client(timeout=60.0, trust_env=False) as client:
            resp = client.post(url, json=payload, headers=headers)
            
            # Se o Google responder com 503 (indisponível temporário), tenta novamente
            if resp.status_code == 503 and attempt < max_retries:
                print(f"[IA] Modelo sobrecarregado (503). Tentativa {attempt}/{max_retries}. Re-tentando em {retry_delay}s...")
                time.sleep(retry_delay)
                continue
                
            return {
                "status_code": resp.status_code,
                "text": resp.text
            }


async def _chat(system: str, user: str) -> str:
    settings = get_settings()
    if not settings.ai_api_key or not settings.ai_model:
        raise AINotConfiguredError("A chave ou o modelo da IA não estão configurados no servidor.")

    url = f"{settings.ai_base_url.rstrip('/')}/chat/completions"
    
    payload = {
    "model": settings.ai_model,
    "temperature": 0.1, 
    "max_tokens": 1500,
    "messages": [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ],
}
    
    headers = {
        "Authorization": f"Bearer {settings.ai_api_key}",
        "Content-Type": "application/json",
    }

    try:
        print("[IA] Enviando requisição para a API do Google...")
        result = await asyncio.to_thread(_sync_chat_request, url, payload, headers)
        print(f"[IA] Resposta recebida! Status: {result['status_code']}")
    except Exception as exc:
        print(f"[IA] Falha de conexão HTTP: {type(exc).__name__} - {exc}")
        raise AIServiceError("Não foi possível falar com o serviço de IA.") from exc

    if result["status_code"] != 200:
        print(f"[IA] Detalhes do erro retornado pelo Google ({result['status_code']}): {result['text']}")
        raise AIServiceError(f"O serviço de IA respondeu com erro ({result['status_code']}).")

    try:
        data = json.loads(result["text"])
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, ValueError, json.JSONDecodeError) as exc:
        raise AIServiceError("A IA devolveu uma resposta em formato inesperado.") from exc


async def correct_answer(situation: str, reference: str, answer: str) -> dict:
    """
    Envia a frase digitada pelo usuário para correção pedagógica
    e retorna o resultado estruturado em dicionário/JSON.
    """
    system_prompt = (
        "Você é um tutor de inglês atencioso e preciso. "
        "Avalie a resposta do aluno comparando-a com a situação e a frase de referência. "
        "Responda EXCLUSIVAMENTE em formato JSON válido com a seguinte estrutura exatamente:\n"
        "{\n"
        '  "correct": boolean,\n'
        '  "feedback": "Explicação amigável e clara em português do Brasil sobre a resposta",\n'
        '  "suggestion": "Sugestão ideal da frase em inglês"\n'
        "}"
    )

    user_prompt = (
        f"Situação: {situation}\n"
        f"Referência esperada: {reference}\n"
        f"Resposta do aluno: {answer}"
    )

    raw_response = await _chat(system_prompt, user_prompt)

    try:
        cleaned = raw_response.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
        cleaned = cleaned.strip()

        return json.loads(cleaned)
    except json.JSONDecodeError as exc:
        print(f"[IA] Erro ao decodificar JSON da resposta: {raw_response}")
        raise AIServiceError("A IA gerou um formato de resposta inválido.") from exc


# Alias para compatibilidade
correct_exercise = correct_answer

from dataclasses import dataclass


@dataclass
class GeneratedExercise:
    level: int
    situation: str
    hint: str
    suggestion: str


async def generate_exercises(
    topic: str, count: int = 5
) -> list[GeneratedExercise]:
    """
    Gera exercícios de inglês usando IA.
    Retorna uma lista compatível com o endpoint /api/generate.
    """

    system_prompt = (
        "Você é um professor de inglês para estudantes brasileiros. "
        "Crie exercícios de formação de frases em inglês. "
        "Os enunciados e as dicas devem estar em português brasileiro. "
        "As sugestões de resposta devem estar em inglês. "
        "Distribua os exercícios entre os níveis 1, 2 e 3, "
        "com dificuldade progressiva. "
        "Responda exclusivamente com JSON válido, sem Markdown. "
        "Utilize exatamente esta estrutura: "
        '{"exercises": ['
        '{"level": 1, '
        '"situation": "Diga que você está estudando inglês agora.", '
        '"hint": "Use am + verbo com -ing.", '
        '"suggestion": "I am studying English now."}'
        "]}"
    )

    user_prompt = (
        f"Tópico de gramática: {topic}\n"
        f"Quantidade de exercícios: {count}\n"
        "Crie exatamente a quantidade solicitada. "
        "Cada exercício deve conter level, situation, hint "
        "e suggestion. Use situações variadas e adequadas "
        "ao tópico informado."
    )

    raw_response = await _chat(system_prompt, user_prompt)

    try:
        cleaned = raw_response.strip()

        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[-1]
            cleaned = cleaned.rsplit("```", 1)[0].strip()

        data = json.loads(cleaned)

        items = data["exercises"]

        if not isinstance(items, list) or len(items) != count:
            raise ValueError(
                "Quantidade de exercícios inválida."
            )

        exercises = []

        for item in items:
            if not isinstance(item, dict):
                raise ValueError("Exercício inválido.")

            level = item["level"]
            situation = item["situation"]
            hint = item["hint"]
            suggestion = item["suggestion"]

            if (
                type(level) is not int
                or level not in (1, 2, 3)
                or not all(
                    isinstance(value, str) and value.strip()
                    for value in (situation, hint, suggestion)
                )
            ):
                raise ValueError(
                    "Campos do exercício inválidos."
                )

            exercises.append(
                GeneratedExercise(
                    level=level,
                    situation=situation.strip(),
                    hint=hint.strip(),
                    suggestion=suggestion.strip(),
                )
            )

        return exercises

    except (ValueError, KeyError, TypeError) as exc:
        raise AIServiceError(
            "A IA não retornou exercícios em formato válido."
        ) from exc
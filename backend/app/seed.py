SEED_TOPICS: list[dict] = [
    {
        "id": "sp",
        "title": "Simple Present (Rotina)",
        "description": "Frases sobre hábitos diários, horários e ações frequentes.",
        "level": 1,
    },
    {
        "id": "pc",
        "title": "Pedidos Educados (Cantina e Compras)",
        "description": "Como pedir alimentos, perguntar preços e formas de pagamento.",
        "level": 1,
    },
    {
        "id": "ta",
        "title": "There is / There are",
        "description": "Descrevendo objetos e lugares no singular e no plural.",
        "level": 2,
    },
]

SEED_EXERCISES: dict[str, dict] = {
    "sp-1": {
        "topic_id": "sp",
        "level": 1,
        "situation": "Diga que você acorda às 7 horas.",
        "hint": "Use 'wake up' + 'at' antes do horário.",
        "suggestion": "I wake up at 7 o'clock.",
    },
    "sp-2": {
        "topic_id": "sp",
        "level": 2,
        "situation": "Diga que sua amiga Ana estuda inglês toda segunda-feira.",
        "hint": "Na 3ª pessoa (Ana/she), o verbo 'study' muda para 'studies'.",
        "suggestion": "Ana studies English every Monday.",
    },
    "sp-3": {
        "topic_id": "sp",
        "level": 3,
        "situation": "Diga que seu irmão não gosta de acordar cedo.",
        "hint": "Use 'doesn't like' para negação na 3ª pessoa.",
        "suggestion": "My brother doesn't like to wake up early.",
    },
    "pc-1": {
        "topic_id": "pc",
        "level": 1,
        "situation": "Peça um sanduíche na cantina, com educação.",
        "hint": "Use 'I'd like...' e termine com 'please'.",
        "suggestion": "I'd like a sandwich, please.",
    },
    "pc-2": {
        "topic_id": "pc",
        "level": 2,
        "situation": "Pergunte quanto custa o suco.",
        "hint": "Use 'How much is...?' para perguntar preço no singular.",
        "suggestion": "How much is the juice?",
    },
    "pc-3": {
        "topic_id": "pc",
        "level": 2,
        "situation": "Pergunte se você pode pagar com cartão.",
        "hint": "Comece a pergunta com 'Can I pay...'.",
        "suggestion": "Can I pay by card?",
    },
    "ta-1": {
        "topic_id": "ta",
        "level": 1,
        "situation": "Diga que há uma mesa na sala.",
        "hint": "Use 'There is' para singular.",
        "suggestion": "There is a table in the room.",
    },
    "ta-2": {
        "topic_id": "ta",
        "level": 2,
        "situation": "Diga que há três cadeiras na sala.",
        "hint": "Use 'There are' para plural.",
        "suggestion": "There are three chairs in the room.",
    },
    "ta-3": {
        "topic_id": "ta",
        "level": 3,
        "situation": "Pergunte se há uma biblioteca na escola.",
        "hint": "Inverta para 'Is there...' em perguntas no singular.",
        "suggestion": "Is there a library in the school?",
    },
}

DEMO_USERS: list[dict] = [
    {
        "id": "user-demo-teacher",
        "name": "Prof. Carlos (Demo)",
        "email": "professor@fraseafrase.com",
        "password": "prof123",
        "role": "teacher",
    },
    {
        "id": "user-demo-student",
        "name": "Ana Aluna (Demo)",
        "email": "aluno@fraseafrase.com",
        "password": "aluno123",
        "role": "student",
    },
]
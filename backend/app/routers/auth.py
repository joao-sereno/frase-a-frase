from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app import store
from app.auth.dependencies import get_current_user
from app.auth.security import create_access_token, verify_password
from app.schemas import TokenResponse, UserCreate, UserLogin, UserOut
from app.store import UserRecord

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])


def _build_token_response(user: UserRecord) -> TokenResponse:
    token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(
        access_token=token,
        user=UserOut(id=user.id, name=user.name, email=user.email, role=user.role),
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED, summary="Cadastra um novo usuário")
def register(body: UserCreate) -> TokenResponse:
    try:
        user = store.create_user(
            name=body.name,
            email=body.email,
            password=body.password,
            role=body.role,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return _build_token_response(user)


@router.post("/login", response_model=TokenResponse, summary="Login via JSON (para o frontend)")
def login(body: UserLogin) -> TokenResponse:
    user = store.get_user_by_email(body.email)
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
        )
    return _build_token_response(user)


@router.post("/token", response_model=TokenResponse, summary="Login OAuth2 (usado pelo botão Authorize do /docs)")
def login_swagger_form(form_data: OAuth2PasswordRequestForm = Depends()) -> TokenResponse:
    user = store.get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return _build_token_response(user)


@router.get("/me", response_model=UserOut, summary="Retorna os dados do usuário autenticado")
def me(current_user: UserRecord = Depends(get_current_user)) -> UserOut:
    return UserOut(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
    )
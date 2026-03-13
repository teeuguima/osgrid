# OSGrid - Mobile App 📱

Este documento detalha os passos necessários para configurar o ambiente de desenvolvimento e rodar o projeto em modo debug.

---

## 💻 Pré-requisitos do Sistema

Antes de começar, você precisa garantir que sua máquina tem as ferramentas básicas instaladas.

### 🟢 Requisitos Globais

- **Node.js**: v18.x ou superior (LTS recomendada).
- **Gerenciador de Pacotes**: `npm` ou `yarn`.
- **Java Development Kit (JDK)**: Versão 11 ou 17 (obrigatório para compilação Android).
- **Git**: Para versionamento.

---

## 🛠️ Configuração por Plataforma

### 🤖 Android (Windows, Linux ou macOS)

1.  **Android Studio**: Instale a versão mais recente.
2.  **SDK Manager**:
    - Instale o **Android SDK Platform 33 ou 34**.
    - Certifique-se de ter o **Android SDK Build-Tools** e o **Android Emulator** instalados.
3.  **Variáveis de Ambiente**: Configure o `ANDROID_HOME` no seu sistema e adicione os caminhos de `platform-tools` ao seu PATH.

### 🍎 iOS (Apenas macOS)

1.  **Xcode**: Instale via App Store (versão 14 ou superior).
2.  **CocoaPods**: Gerenciador de dependências nativas do iOS.
    ```bash
    sudo gem install cocoapods
    ```
3.  **Command Line Tools**: No Xcode, vá em _Settings > Locations_ e selecione a versão atual no dropdown.

---

## 🚀 Etapas Iniciais de Configuração

Siga estes comandos em ordem no seu terminal:

1.  **Clonar o Projeto:**

    ```bash
    git clone [https://github.com/seu-usuario/osgrid.git](https://github.com/seu-usuario/osgrid.git)
    cd osgrid
    ```

2.  **Instalar Dependências de JavaScript:**

    ```bash
    npm install
    # ou se usar yarn:
    yarn install
    ```

3.  **Instalar Dependências Nativas (iOS):**
    _Pule este passo se estiver no Windows ou Linux._

    ```bash
    cd ios && pod install && cd ..
    ```

4.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base) e insira as chaves de API e URLs do Backend.

---

## 👨‍💻 Executando em Modo Debug

Para rodar o projeto com suporte a Hot Reload e ferramentas de inspeção:

# 🛠️ Primeiros Passos

Siga estes comandos para preparar o projeto após clonar o repositório:

## Instalar Dependências JS

```bash
npm install
```

## Instalar Dependências Nativas (iOS apenas)

```bash
cd ios && pod install && cd ..
```

## Configurar Variáveis (.env)

Copie o arquivo de exemplo e preencha com as URLs de API:

```bash
cp .env.example .env
```

---

# 🚀 Executando o Projeto em Modo Debug

Para rodar a aplicação com suporte a _Hot Reloading_, siga estes dois passos em terminais separados:

## 1️⃣ Iniciar o Metro Bundler

O Metro é o servidor que compila o JavaScript para o dispositivo.

```bash
npx react-native start
```

## 2️⃣ Iniciar a Aplicação

Com o Metro rodando, abra uma nova aba no terminal e escolha a plataforma.

### Para Android

```bash
npx react-native run-android
```

### Para iOS

```bash
npx react-native run-ios
```

---

# ⚠️ Notas Importantes

**Processadores Apple (M1/M2/M3)**: Se o `pod install` falhar, tente:

```bash
arch -x86_64 pod install
```

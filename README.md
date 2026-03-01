# Pomodoro Front

Sistema de gerenciamento de tempo usando a técnica Pomodoro, desenvolvido com Next.js, React e Tailwind CSS.

## 🎨 Design System

### Cores

- **Background**: `#21182F` - Cor de fundo principal
- **Box Primary**: `#312447` - Cor de fundo dos boxes
- **Box Border**: `#3F2E5A` - Cor das bordas dos boxes
- **Box Inner**: `#654D8C` - Cor de fundo interna dos boxes
- **Text Primary**: `#E8EBFF` - Cor principal do texto
- **Button Primary**: `#CCA3FF` - Cor de fundo do botão primário
- **Button Secondary**: `#E8EBFF` - Cor de borda do botão secundário

### Componentes

- **Button**: Dois estilos (primary com fundo, secondary com borda)
- **Input**: Campo de entrada com suporte a label, erro e mensagem de ajuda
- **Accordion**: Componente expansível para FAQ

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção
npm start
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura do Projeto

```
pomodoro-front/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Accordion/
│   │   └── Accordion.tsx
│   ├── Button/
│   │   └── Button.tsx
│   └── Input/
│       └── Input.tsx
├── lib/
│   └── utils.ts
└── tailwind.config.ts
```

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones

## 📝 Páginas

- **Home**: Página inicial com hero section e FAQ
- **Onboarding**: (Em desenvolvimento)

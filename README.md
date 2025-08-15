# 🖼️ IMGConvert - Conversor de Imagens Profissional

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **Transforme suas imagens com elegância e precisão!** 🎨

Um conversor de imagens moderno, rápido e intuitivo construído com Next.js 14 e React 18. Converta, redimensione e otimize suas imagens diretamente no navegador com uma interface elegante e responsiva.

## ✨ Características Principais

### 🚀 **Conversão Inteligente**
- **Formatos Suportados**: JPG, PNG, WebP, BMP, AVIF
- **Conversão em Lote**: Processe múltiplas imagens simultaneamente
- **Qualidade Otimizada**: Controle de qualidade para formatos JPEG
- **Processamento Local**: 100% no navegador - suas imagens nunca saem do seu dispositivo

### 🎯 **Redimensionamento Avançado**
- **Modos de Redimensionamento**: Fit (encaixar) e Fill (preencher)
- **Proporção de Aspecto**: Mantenha ou altere as proporções
- **Dimensões Personalizadas**: Largura e altura configuráveis
- **Preview em Tempo Real**: Visualize as mudanças antes de aplicar

### 🎨 **Interface Moderna**
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- **Tema Escuro/Claro**: Alternância automática baseada na preferência do sistema
- **Drag & Drop**: Arraste e solte imagens para upload instantâneo
- **Notificações Toast**: Feedback visual para todas as operações
- **Barra de Progresso**: Acompanhe o progresso das conversões

### 🔧 **Funcionalidades Avançadas**
- **Gerenciamento de Estado**: Context API para gerenciamento robusto
- **Validação de Arquivos**: Verificação de tipos e tamanhos
- **Histórico de Operações**: Rastreie todas as conversões
- **Exportação em Lote**: Baixe todas as imagens convertidas de uma vez

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca de interface do usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e personalizáveis

### **Estilização e UX**
- **Tailwind CSS Animate** - Animações suaves
- **Lucide React** - Ícones modernos e consistentes
- **Sonner** - Notificações toast elegantes
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas

### **Funcionalidades**
- **React Resizable Panels** - Painéis redimensionáveis
- **Next Themes** - Suporte a temas claro/escuro
- **Date-fns** - Manipulação de datas
- **Recharts** - Gráficos e visualizações

## 🚀 Como Usar

### **1. Upload de Imagens**
- Arraste e solte imagens na área de upload
- Ou clique para selecionar arquivos do seu dispositivo
- Suporte para múltiplos arquivos simultâneos

### **2. Configuração de Conversão**
- Selecione o formato de destino desejado
- Ajuste as configurações de redimensionamento
- Configure a qualidade (para formatos JPEG)

### **3. Processamento**
- Clique em "Converter" para iniciar o processo
- Acompanhe o progresso em tempo real
- Receba notificações de conclusão

### **4. Download**
- Baixe imagens individuais ou em lote
- Todas as imagens são processadas localmente
- Nenhum dado é enviado para servidores externos

## 📦 Instalação

### **Pré-requisitos**
- Node.js 18+ 
- npm, yarn ou pnpm

### **1. Clone o repositório**
```bash
git clone https://github.com/aMathyzinn/ImgC.git
cd ImgC
```

### **2. Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### **3. Execute em modo de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

### **4. Abra no navegador**
```
http://localhost:3000
```

## 🏗️ Estrutura do Projeto

```
conversor/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/             # Componentes React
│   ├── actions/           # Ações globais
│   ├── feedback/          # Notificações e progresso
│   ├── files/             # Gerenciamento de arquivos
│   ├── layout/            # Componentes de layout
│   ├── theme-provider.tsx # Provedor de tema
│   ├── ui/                # Componentes de UI
│   └── upload/            # Área de upload
├── contexts/               # Contextos React
│   └── ImageConverterContext.tsx
├── hooks/                  # Hooks customizados
├── lib/                    # Utilitários
├── utils/                  # Funções utilitárias
│   ├── imageUtils.ts      # Conversão de imagens
│   └── resizeUtils.ts     # Redimensionamento
└── public/                 # Arquivos estáticos
```

## 🔧 Scripts Disponíveis

```json
{
  "dev": "next dev",           # Servidor de desenvolvimento
  "build": "next build",       # Build de produção
  "start": "next start",       # Servidor de produção
  "lint": "next lint"          # Verificação de código
}
```

## 🌟 Funcionalidades em Destaque

### **Conversão Inteligente**
```typescript
// Suporte para múltiplos formatos
export type ImageFormat = "jpeg" | "png" | "webp" | "bmp" | "avif"

// Conversão com controle de qualidade
const quality = targetFormat === "jpeg" ? 0.9 : undefined
```

### **Redimensionamento Avançado**
```typescript
// Múltiplos modos de redimensionamento
export type ResizeMode = "fit" | "fill"

// Configurações flexíveis
interface ResizeSettings {
  width?: number
  height?: number
  maintainAspectRatio: boolean
  mode: ResizeMode
  enabled: boolean
}
```

### **Gerenciamento de Estado**
```typescript
// Context API para estado global
const [state, dispatch] = useReducer(reducer, initialState)

// Ações tipadas para melhor DX
type Action = 
  | { type: "ADD_FILES"; payload: File[] }
  | { type: "START_CONVERSION"; payload: string }
  | { type: "COMPLETE_CONVERSION"; payload: { id: string; blob: Blob } }
```

## 🎨 Personalização

### **Temas**
- Suporte nativo a temas claro/escuro
- Alternância automática baseada na preferência do sistema
- Cores personalizáveis via Tailwind CSS

### **Componentes**
- Todos os componentes são altamente personalizáveis
- Sistema de design consistente com Radix UI
- Animações suaves e transições elegantes

## 📱 Responsividade

- **Desktop**: Interface completa com todos os recursos
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Interface otimizada para dispositivos móveis
- **Touch**: Suporte completo para gestos de toque

## 🔒 Segurança e Privacidade

- **Processamento Local**: Todas as imagens são processadas no navegador
- **Sem Upload**: Nenhum arquivo é enviado para servidores externos
- **Validação de Arquivos**: Verificação de tipos e tamanhos
- **Limpeza de Memória**: URLs de objeto são revogadas automaticamente

## 🚀 Roadmap

### **Versão 1.1**
- [ ] Suporte para mais formatos (TIFF, GIF)
- [ ] Filtros e efeitos de imagem
- [ ] Compressão inteligente
- [ ] Histórico de conversões

### **Versão 1.2**
- [ ] API REST para conversão em lote
- [ ] Integração com serviços de nuvem
- [ ] Plugins para editores populares
- [ ] Suporte para metadados EXIF

### **Versão 2.0**
- [ ] Editor de imagem integrado
- [ ] Suporte para vídeos
- [ ] Colaboração em tempo real
- [ ] Inteligência artificial para otimização

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### **Diretrizes de Contribuição**
- Siga as convenções de código existentes
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use commits semânticos

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

**© 2025 aMathyzinn. Todos os direitos reservados.**

## 🙏 Agradecimentos

- **Next.js Team** - Framework incrível
- **Vercel** - Deploy e hospedagem
- **Radix UI** - Componentes acessíveis
- **Tailwind CSS** - Framework CSS utilitário
- **Comunidade React** - Inspiração e suporte

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/aMathyzinn/ImgC/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aMathyzinn/ImgC/discussions)
- **Email**: [aMathyzinn](contato@amathyzin.com)

## ⭐ Se Gostou, Deixe uma Estrela!

Se este projeto te ajudou ou você gostou dele, considere dar uma ⭐ no GitHub! Isso nos motiva a continuar melhorando e desenvolvendo novas funcionalidades.

---

**Desenvolvido com ❤️ e ☕ por aMathyzinn**

*Transformando pixels, uma imagem por vez!* 🎨✨

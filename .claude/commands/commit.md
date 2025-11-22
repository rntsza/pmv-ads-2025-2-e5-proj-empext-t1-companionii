# Commit

## Descrição

Um comando personalizado que gera automaticamente mensagens de commit convencionais baseadas nas mudanças em staging e executa o commit, seguindo a configuração do commitlint do projeto.

## Uso

```bash
# Commitar apenas arquivos em staging com mensagem auto-gerada
./commit --staged

# Analisar e criar commits organizados automaticamente dos arquivos não commitados
./commit
```

<command_behavior>

### Argumentos

- `--staged` (opcional): Apenas commita arquivos atualmente em staging com uma única mensagem de commit.

### Fluxo de Execução

#### Modo `--staged` (Commit Único)

1. **Análise de Mudanças**: Analisa as mudanças em staging para entender o que foi modificado
2. **Consulta de Configuração**: Lê o arquivo `commitlint.config.js` para obter tipos e escopos válidos
3. **Geração de Mensagem**: Cria uma mensagem de commit convencional seguindo os padrões do projeto
4. **Commit**: Executa o git commit com a mensagem gerada

#### Modo Padrão (Commits Organizados)

Quando `--staged` não é fornecido, o comando analisa todas as alterações não commitadas e cria commits separados de forma inteligente:

1. **Análise Completa**: Analisa todas as mudanças não commitadas usando `git diff` e `git status`
2. **Consulta de Configuração**: Lê o arquivo `commitlint.config.js` para obter tipos e escopos válidos
3. **Agrupamento Inteligente**: Agrupa arquivos relacionados por contexto, considerando:
   - **Módulo/Escopo**: Arquivos do mesmo módulo ou área do projeto
   - **Tipo de Mudança**: Natureza da alteração (nova feature, fix, docs, refactor, etc.)
   - **Funcionalidade**: Arquivos que fazem parte da mesma funcionalidade ou feature
   - **Relacionamento**: Componentes e seus testes, estilos, tipos relacionados
4. **Criação de Commits**: Para cada grupo identificado:
   - Adiciona os arquivos específicos ao staging
   - Gera mensagem de commit apropriada
   - Executa o commit
   - Limpa o staging para o próximo grupo
5. **Resumo**: Apresenta um resumo de todos os commits criados

### Estratégia de Agrupamento

O agrupamento deve seguir estas prioridades (da maior para a menor):

1. **Por Escopo e Tipo**: Mesmo escopo + mesmo tipo de mudança
   - Exemplo: Todas as features de um mesmo módulo/área
2. **Por Funcionalidade Relacionada**: Arquivos que implementam a mesma feature
   - Exemplo: Componente + testes + tipos da mesma feature
3. **Por Módulo/Área**: Quando tipo varia mas escopo é o mesmo
   - Exemplo: Múltiplas alterações em uma mesma área do projeto
4. **Mudanças Independentes**: Cada alteração significativa em commit separado
   - Exemplo: Fix em um componente, refactor em outro

### Regras de Agrupamento

- **Mínimo de 1 arquivo por commit**: Nunca deixar arquivos sem commit
- **Testes com implementação**: Quando possível, agrupar testes com o código testado
- **Documentação separada**: Commits de documentação devem ser separados de código
- **Arquivos de configuração**: Commits de config separados, exceto quando são parte de uma feature

</command_behavior>

<commit_standards>

## Padrões de Mensagem de Commit

### Estrutura Obrigatória

```
<tipo>(<escopo>): <descrição>

[corpo opcional]
```

### Tipos e Escopos Válidos

**IMPORTANTE**: Os tipos e escopos permitidos devem ser consultados no arquivo `commitlint.config.js` do projeto. Este arquivo contém:

- **type-enum**: Lista de tipos de commit permitidos
- **scope-enum**: Lista de escopos disponíveis para o projeto

**Sempre consulte o arquivo `commitlint.config.js` para obter a lista atualizada de tipos e escopos válidos antes de gerar uma mensagem de commit.**

</commit_standards>

<quality_guidelines>

## Diretrizes de Qualidade

### Regras de Mensagem (SEMPRE em inglês)

- Usar presente imperativo: "add", "fix", "update" (não "added", "fixes", "updating")
- Ser específico e descritivo sobre o que mudou
- Evitar artigos desnecessários: "add feature" não "add a feature"
- Manter título abaixo de 100 caracteres
- Usar minúsculas para a descrição
- Sem ponto final no título

### Qualidade do Conteúdo

- **Seja Específico**: Em vez de "fix bug", use "fix validation error in checkout form"
- **Explique o Porquê**: Quando benéfico, explique a razão da mudança
- **Foque no Impacto**: Descreva o que o usuário ou sistema ganha com a mudança
- **Use Voz Ativa**: "add user authentication" não "user authentication is added"

</quality_guidelines>

<commit_examples>

## Exemplos de Commits

### Exemplos Bons

#### Commits Simples (apenas título)

```bash
feat(user): add email verification for new accounts
fix(checkout): resolve payment validation error on mobile
docs(core): update API documentation for authentication endpoints
style(ui): improve button spacing in navigation bar
refactor(product): extract price calculation to utility function
perf(list): optimize product search with debounced input
test(order): add unit tests for order validation logic
chore(deps): update react to version 18.2.0
```

#### Commits com Corpo Detalhado (quando necessário)

```bash
feat(user): add two-factor authentication

Implement SMS and email-based 2FA to enhance account security.
Users can now enable 2FA in their profile settings.

- Add SMS provider integration
- Create 2FA setup flow
- Add backup codes generation
- Update user settings UI
```

```bash
fix(checkout): resolve timeout issues on payment processing

Payment requests were timing out after 30 seconds causing
abandoned checkouts and customer frustration.

- Increase timeout to 60 seconds
- Add retry mechanism for failed requests
- Improve error handling and user feedback
- Add loading states during processing
```

```bash
refactor(core): migrate authentication to new JWT service

Replace legacy session-based auth with stateless JWT tokens
to improve scalability and enable mobile app integration.

Breaking Changes:
- Old session endpoints are deprecated
- New JWT tokens expire after 24 hours
- Refresh token mechanism required

BREAKING CHANGE: Session-based authentication removed
```

```bash
perf(product): implement lazy loading for product images

Reduce initial page load time by 40% through progressive
image loading and modern formats.

- Add WebP format with JPEG fallback
- Implement intersection observer for lazy loading
- Optimize image sizes for different screen densities
- Add loading placeholders

Performance impact: 2.1s → 1.3s initial load time
```

```bash
chore(build): upgrade webpack to v5 and update build pipeline

Modernize build system to leverage latest webpack features
and improve development experience.

- Upgrade webpack 4 → 5
- Update all related loaders and plugins
- Implement module federation for micro-frontends
- Add better tree-shaking configuration
- Improve hot reload performance

Dev build time: 45s → 12s
```

### Exemplos Ruins (O que NÃO fazer)

```bash
# Muito vago
fix: bug fixes
feat: new stuff
update: changes

# Tempo verbal errado
feat(user): added login functionality
fix(ui): fixed the button

# Escopo ausente quando necessário (se definido no commitlint.config.js)
feat: add user authentication
fix: payment error
```

_Nota: Os tipos e escopos nos exemplos acima são apenas ilustrativos. Sempre consulte o arquivo `commitlint.config.js` para os valores válidos do seu projeto._

</commit_examples>

<ai_implementation_guide>

## Guia de Implementação para IA

### Etapas Obrigatórias

1. **Consultar Configuração**: PRIMEIRO, ler o arquivo `commitlint.config.js` para obter:

   - Lista atual de tipos permitidos (`type-enum`)
   - Lista atual de escopos permitidos (`scope-enum`)
   - Regras de obrigatoriedade do escopo

2. **Analisar Mudanças**: Revisar `git diff --staged` para entender:

   - Quais arquivos foram modificados
   - Que tipo de mudanças foram feitas
   - O escopo das mudanças (qual parte da aplicação)

3. **Determinar Tipo**: Baseado nas mudanças e na lista do `commitlint.config.js`:

   - Arquivos/funcionalidades novas → tipo `feat` (se disponível)
   - Correções de bugs → tipo `fix` (se disponível)
   - Documentação → tipo `docs` (se disponível)
   - Formatação/estilo → tipo `style` (se disponível)
   - Reorganização de código → tipo `refactor` (se disponível)
   - Performance → tipo `perf` (se disponível)
   - Testes → tipo `test` (se disponível)
   - Dependências/configuração → tipo `chore` (se disponível)

4. **Selecionar Escopo**: Da lista do `commitlint.config.js`, escolher baseado em:

   - Área primária afetada
   - Se múltiplas áreas, usar a mais significativa
   - Se incerto, omitir escopo ao invés de adivinhar

5. **Criar Descrição**: Escrever descrição que:

   - Use modo imperativo inglês
   - Descreva a mudança real feita
   - Foque no benefício para usuário/sistema
   - Mantenha abaixo de 100 caracteres

6. **Validar**: Garantir conformidade com:
   - Formato conventional commits
   - Tipos/escopos do `commitlint.config.js`
   - Regras de qualidade estabelecidas

</ai_implementation_guide>

<success_criteria>

## Critérios de Sucesso

Uma mensagem de commit bem-sucedida deve:

- ✅ Seguir formato de conventional commit exato
- ✅ Usar APENAS tipos e escopos definidos no `commitlint.config.js`
- ✅ Estar em inglês com modo imperativo perfeito
- ✅ Ser específica e descritiva sobre a mudança real
- ✅ Ter menos de 100 caracteres no título
- ✅ Representar com precisão as mudanças feitas
- ✅ Ser consistente com convenções do projeto
- ✅ Passar na validação do commitlint

</success_criteria>

<error_handling>

## Tratamento de Erros

O comando deve tratar adequadamente:

- **Sem mudanças em staging**: Informar usuário claramente
- **Repositório Git não encontrado**: Mostrar erro específico
- **Arquivo commitlint.config.js não encontrado**: Alertar sobre configuração
- **Falhas no commit**: Exibir erro completo do git
- **Estado inválido do git**: Conflitos, merge em andamento, etc.
- **Tipos/escopos inválidos**: Validar contra configuração atual

</error_handling>

<output_format>

## Formato de Saída Esperado

### Modo `--staged` (Commit Único)

```bash
🔍 Consultando configuração do commitlint...
📋 Tipos disponíveis: feat, fix, docs, style, refactor, perf, test, chore
📂 Escopos disponíveis: auth, api, ui, database, config
🔍 Analisando mudanças em staging...
📝 Mensagem de commit gerada: "feat(auth): add password reset functionality"
✅ Commit realizado com sucesso!

Commit: a1b2c3d
Arquivos alterados: 3
```

### Modo Padrão (Commits Organizados)

```bash
🔍 Consultando configuração do commitlint...
📋 Tipos disponíveis: feat, fix, docs, style, refactor, perf, test, chore
📂 Escopos disponíveis: auth, api, ui, database, config

🔍 Analisando todas as mudanças não commitadas...
📊 Encontrados 15 arquivos modificados

🧩 Agrupando mudanças por contexto...
✅ Identificados 4 grupos de commits

📦 Grupo 1/4: UI Components - Nova feature
   Arquivos: 5
   - src/components/Button/index.tsx
   - src/components/Button/styles.css
   - src/components/Button/types.ts
   - src/components/Button/__tests__/Button.test.tsx
   - src/components/index.ts

📝 Mensagem: "feat(ui): add new button component with variants"
✅ Commit criado: b2c3d4e

📦 Grupo 2/4: Authentication - Fix
   Arquivos: 3
   - src/services/auth/index.ts
   - src/services/auth/validateToken.ts
   - src/hooks/useAuth.ts

📝 Mensagem: "fix(auth): resolve token validation on refresh"
✅ Commit criado: c3d4e5f

📦 Grupo 3/4: API Integration
   Arquivos: 4
   - src/api/client.ts
   - src/api/endpoints/users.ts
   - src/api/endpoints/posts.ts
   - src/types/api.ts

📝 Mensagem: "feat(api): add user and post endpoints"
✅ Commit criado: d4e5f6a

📦 Grupo 4/4: Documentação
   Arquivos: 3
   - docs/api/authentication.md
   - README.md
   - CHANGELOG.md

📝 Mensagem: "docs(api): update authentication documentation"
✅ Commit criado: e5f6a7b

🎉 Processo concluído!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Resumo:
   • 4 commits criados
   • 15 arquivos commitados
   • 0 arquivos ignorados

💡 Use 'git log --oneline -4' para ver os commits criados
```

### Em Caso de Erro

```bash
❌ Erro: Nenhuma mudança encontrada
💡 Não há arquivos modificados para commitar

❌ Erro: Nenhuma mudança encontrada em staging
💡 Use 'git add .' para adicionar arquivos ou './commit' sem --staged

❌ Erro: Arquivo commitlint.config.js não encontrado
💡 Certifique-se de que o projeto possui configuração do commitlint

❌ Erro ao criar commit do Grupo 2/4
💡 Revise as mudanças e tente novamente
```

</output_format>

<best_practices_for_ai>

## Boas Práticas para IA

### Análise de Contexto

- Examinar nomes de arquivos para identificar área de impacto
- Analisar o diff para entender a natureza da mudança
- Considerar padrões existentes no histórico de commits
- Identificar se é adição, remoção ou modificação de funcionalidade
- Verificar se há testes relacionados às mudanças

### Geração de Mensagem Inteligente

- Priorizar clareza sobre brevidade
- Usar verbos que descrevem ação realizada de forma precisa
- Incluir contexto suficiente para entender a mudança
- Evitar jargões técnicos desnecessários
- Manter consistência com estilo do projeto
- Considerar o público-alvo da mensagem (outros desenvolvedores)

### Validação Rigorosa

- **SEMPRE** verificar tipos e escopos contra `commitlint.config.js`
- Confirmar que descrição usa modo imperativo correto
- Checar comprimento exato da mensagem
- Validar se mensagem descreve adequadamente a mudança
- Testar mentalmente se a mensagem seria útil em um histórico de commits

### Comportamento Inteligente

- Se mudanças abrangem múltiplas áreas, escolher a mais significativa
- Se tipo de mudança é ambíguo, escolher o mais conservador
- Se escopo é incerto, omitir ao invés de adivinhar
- Se descrição fica muito longa, priorizar a informação mais importante
- Se há conflito entre clareza e brevidade, preferir clareza dentro do limite

### Agrupamento Inteligente (Modo Padrão)

Quando no modo padrão (sem `--staged`), aplique estas diretrizes para agrupar commits:

#### Identificação de Padrões

- **Estrutura de pastas**: Analise a estrutura do projeto para mapear pastas → escopos do `commitlint.config.js`
  - Exemplos comuns de mapeamento:
    - `src/components/`, `components/` → escopo relacionado a UI/components
    - `src/services/`, `services/` → escopo relacionado a services/api
    - `src/utils/`, `utils/` → escopo de utilities
    - `packages/[nome]/`, `modules/[nome]/` → escopo `[nome]`
    - `apps/[nome]/` → escopo relacionado ao app específico
    - `docs/`, `documentation/` → tipo `docs`
    - `tests/`, `__tests__/` → tipo `test`
- **Relacionamento de arquivos**:
  - Componente + teste + tipos = mesmo commit (se mesma feature)
  - Múltiplos arquivos do mesmo componente/funcionalidade = mesmo commit
  - Alterações em múltiplos apps/packages da mesma feature = pode ser agrupado se fortemente relacionado

#### Decisões de Agrupamento

- **Priorize coesão**: Arquivos que juntos formam uma unidade lógica de trabalho
- **Contexto sobre quantidade**: Melhor 1 commit com 10 arquivos relacionados que 10 commits de 1 arquivo cada
- **Evite misturar tipos**: Não misture `feat` com `fix` no mesmo commit
- **Separe documentação de código**: Exceto quando a doc é parte essencial da feature
- **Considere dependências**: Se arquivo A depende de arquivo B, ambos devem estar no mesmo commit
- **Respeite boundaries**: Não misture módulos diferentes a menos que seja uma integração explícita

#### Análise de Diff

Para cada arquivo modificado, analise:

- **Tipo de mudança**: Adição, remoção, modificação
- **Impacto**: Quebra compatibilidade? É refactor? É nova feature?
- **Escopo**: Qual módulo/app é afetado?
- **Relacionamentos**: Quais outros arquivos são impactados ou relacionados?

#### Geração de Grupos

1. **Primeira passada**: Identifique grupos óbvios (mesmo caminho base + mesmo tipo)
2. **Segunda passada**: Identifique relacionamentos entre arquivos
3. **Terceira passada**: Agrupe arquivos relacionados que estão em grupos diferentes
4. **Validação final**: Verifique se cada grupo faz sentido como uma unidade atômica de mudança

#### Casos Especiais

- **Alterações cross-module**: Se uma feature atravessa múltiplos módulos, considere:
  - Se são fortemente acopladas → um commit com escopo do módulo principal
  - Se são independentes → commits separados por módulo
- **Múltiplos apps/packages**: Se a mesma mudança é replicada em vários:
  - Use escopo genérico (ex: `apps`, `packages`) se a mudança é idêntica em todos
  - Use commits separados se há nuances em cada um
- **Arquivos de configuração**:
  - Junto com código se é config específica da feature
  - Separado se é atualização geral de dependências ou tooling
- **Testes**:
  - Junto com implementação sempre que possível
  - Separado apenas se são testes retroativos para código existente

#### Mensagens para Grupos

- **Descreva o grupo como um todo**: "add authentication service with token validation"
- **Não liste arquivos**: A mensagem descreve a mudança, não os arquivos
- **Use singular ou plural apropriado**:
  - Um componente/arquivo → "add login form component"
  - Vários componentes/arquivos → "add authentication components"
- **Seja específico sobre a funcionalidade**: Em vez de "update UI", use "add dark mode support to header"

</best_practices_for_ai>

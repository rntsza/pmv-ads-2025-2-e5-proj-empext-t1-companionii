---
description: Gera casos de teste para um requisito funcional (RF)
---

# Gerador de Casos de Teste - Requisitos Funcionais

Você é um especialista em QA analisando o projeto Companion.

## Instrução

O usuário fornecerá um código de requisito funcional (ex: "RF-005"). Execute:

<arguments>
#$ARGUMENTS
</arguments>

SE o RF não for fornecido perguntar ao usuário. NÃO PROSSIGA SEM O RF.

### 1. Análise do Requisito

- Leia `documentos/02-Especificação do Projeto.md`
- Extraia descrição, critérios de aceitação, prioridade e responsáveis do RF solicitado

### 2. Localização da Implementação

**Backend** (`codigo-fonte/backend/src/`):

- Controllers em `*/controllers/`
- Services em `*/services/`
- DTOs em `*/dto/`

**Frontend** (`codigo-fonte/frontend/src/`):

- Componentes em `components/`
- Páginas em `pages/`
- Hooks em `hooks/`

Consulte também se disponivel:

- `codigo-fonte/specs/technical/API_SPECIFICATION.md`
- `codigo-fonte/specs/technical/BUSINESS_LOGIC.md`

### 3. Extração de Cenários

Identifique:

- Fluxo principal (happy path)
- Fluxos alternativos
- Validações de campos
- Tratamento de erros
- Regras de negócio
- Integrações

### 4. Geração do Documento

Crie `documentos/Testes/Teste_{RF}.md`:

Use HTML tables para cada caso de teste. Formato:

```markdown
# {RF-ID}
## {Nome do Requisito}

<table>
  <tr>
    <th colspan="6" width="1000">CT-{RF}01<br>{Nome do Caso de Teste}</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">{Descrição clara e objetiva do que o sistema deve fazer neste caso de teste}</td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Desenvolvimento: {Nome do desenvolvedor ou "Realizado em grupo"}<br>Teste: {Nome do testador}</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">{DD/MM/AAAA}</td>
  </tr>
  <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">{Comentário descritivo sobre o resultado do teste - ex: "Funcionalidade implementada corretamente. O sistema valida os campos obrigatórios e exibe mensagens apropriadas." ou "Teste passou com sucesso. A interface responde conforme esperado."}</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center">⚠️ Screenshot deve ser adicionada pelo testador</td>
  </tr>
</table>

<br>

<table>
  <tr>
    <th colspan="6" width="1000">CT-{RF}02<br>{Nome do Segundo Caso de Teste}</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">{Descrição do segundo caso de teste}</td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Desenvolvimento: {Nome do desenvolvedor ou "Realizado em grupo"}<br>Teste: {Nome do testador}</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">{DD/MM/AAAA}</td>
  </tr>
  <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">{Comentário descritivo sobre o resultado}</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center">⚠️ Screenshot deve ser adicionada pelo testador</td>
  </tr>
</table>

---

## Observações Técnicas

**Endpoints testados:**
- `{METHOD} /api/{path}` - {Descrição}

**Componentes testados:**
- `{ComponentName}` (`{caminho/arquivo.tsx:linha}`) - {Função}

**Validações:**
- {Validação 1}
- {Validação 2}

**Regras de negócio:**
- {Regra 1}
```

## Regras

1. **Nomenclatura**: `CT-{RF}01`, `CT-{RF}02`, etc.
2. **Limite**: Máximo 5 casos de teste por RF
3. **Complexidade**: Focar em testes simples e diretos
   - Fluxo principal (happy path)
   - Validações básicas de campos obrigatórios
   - Erros mais comuns
4. **Formato**: Tabelas HTML conforme template acima
5. **Comentários**: Sempre gerar comentários descritivos e informativos sobre o resultado do teste
   - Descrever o que foi testado
   - Confirmar se passou ou falhou
   - Adicionar observações relevantes
6. **Screenshots**: Placeholder apenas, usuário adiciona depois

## Output Final

Após criar o arquivo, reporte:

- Número de casos gerados
- Endpoints/componentes cobertos
- Validações identificadas
- Gaps de cobertura (se houver)

**IMPORTANTE**: Baseie-se no código REAL. Se RF não estiver implementado, informe.

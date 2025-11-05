# Planos de Testes de Software – **Página de Tarefas / Kanban**

| ID             | Requisito | Descrição do Caso de Teste                                               | Entrada de Dados                                         | Resultado Esperado                                                                                      | Prioridade |
| -------------- | --------- | ------------------------------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------- |
| **CT-001-S**   | RF-003    | Exibição da página de tarefas e dos filtros (busca, projeto, status)     | —                                                        | Campos de busca, filtro por projeto e filtro por status são exibidos corretamente                       | Alta       |
| **CT-002-S**   | RF-003    | Criação de nova tarefa com dados válidos                                 | Título, descrição, projeto, prioridade, status           | Tarefa criada, toast “Tarefa criada com sucesso!”, e nova tarefa aparece no Kanban                      | Alta       |
| **CT-003-S**   | RF-004    | Exibição das colunas Kanban com contadores corretos                      | —                                                        | Quatro colunas: “A Fazer”, “Em Progresso”, “Revisão” e “Concluído”, com contagem coerente de tarefas    | Alta       |
| **CT-004-S**   | RF-004    | Mover tarefa entre colunas (drag-and-drop)                               | Tarefa existente movida de “A Fazer” para “Em Progresso” | Status da tarefa atualizado e mantido após recarregar a página                                          | Alta       |
| **CT-005-S**   | RF-003    | Edição de tarefa existente                                               | Alteração de título, descrição e prioridade              | Toast “Tarefa atualizada!” exibido e tarefa atualizada na lista                                         | Alta       |
| **CT-006-S**   | RF-003    | Exclusão de tarefa existente                                             | Seleção de tarefa e confirmação de exclusão              | Toast “Tarefa excluída!” exibido e tarefa removida do Kanban                                            | Alta       |
| **CT-007-S**   | RF-009    | Aplicação de filtros de projeto e busca                                  | Projeto específico e termo no campo “Buscar tarefas…”    | Apenas tarefas do projeto/termo filtrado são exibidas                                                   | Média      |
| **CT-008-S**   | RF-004    | Alternar entre visualização Kanban e Lista                               | Clique nos botões de alternância                         | Layout alterna entre colunas e lista, mantendo as mesmas tarefas                                        | Média      |
| **CT-009-I01** | RF-003    | Tentativa de criação de tarefa com campos obrigatórios vazios            | Título vazio ou projeto não selecionado                  | Toast de erro “Não foi possível criar a tarefa.” e tarefa não é criada                                  | Alta       |
| **CT-010-I01** | RF-004    | Falha ao mover tarefa (erro no backend)                                  | Simular erro 500 em `tasksService.updateStatus`          | Toast “Falha ao mover tarefa. Voltando ao estado anterior.” exibido e tarefa retorna ao estado original | Alta       |
| **CT-011-I01** | RF-003    | Falha ao atualizar tarefa (erro no backend)                              | Simular erro ao salvar edição                            | Toast “Não foi possível atualizar a tarefa.” exibido                                                    | Alta       |
| **CT-012-I01** | RF-003    | Falha ao excluir tarefa (erro no backend)                                | Simular erro ao excluir                                  | Toast “Não foi possível excluir a tarefa.” exibido e tarefa permanece visível                           | Alta       |
| **CT-013-S**   | RF-011    | Verificar atualização de data/hora ao mover tarefa concluída (auditoria) | Tarefa com status DONE                                   | Campo “Concluído em” atualizado corretamente no modal de detalhes                                       | Média      |

---

## Casos de Teste de **Sucesso**

### CT-001-S – Exibição da página e filtros

```
<table>
  <tr><th colspan="2">CT-001-S<br>Exibição da página de tarefas e filtros</th></tr>
  <tr><td><strong>Descrição</strong></td><td>Validar renderização dos componentes principais (busca, filtros e botões de visualização).</td></tr>
  <tr><td><strong>Responsável</strong></td><td>Desenvolvedor Frontend</td></tr>
  <tr><td><strong>Tipo</strong></td><td>Sucesso</td></tr>
  <tr><td><strong>Requisitos associados</strong></td><td>RF-003, RF-009</td></tr>
  <tr><td><strong>Passos</strong></td><td>
1. Acessar /tasks (ou /kanban).<br>
2. Verificar campo “Buscar tarefas…”.<br>
3. Verificar selects de “Projeto” e “Status”.<br>
4. Confirmar botão “+ Nova Tarefa” e alternadores Kanban/Lista visíveis.
</td></tr>
  <tr><td><strong>Dados</strong></td><td>—</td></tr>
  <tr><td><strong>Critério de êxito</strong></td><td>Toda a interface e filtros renderizados corretamente.</td></tr>
</table>
```

### CT-002-S – Criação de nova tarefa

```
<table>
  <tr><th colspan="2">CT-002-S<br>Criação de nova tarefa com dados válidos</th></tr>
  <tr><td><strong>Descrição</strong></td><td>Garantir que a criação de tarefa funciona e é exibida no quadro.</td></tr>
  <tr><td><strong>Responsável</strong></td><td>Desenvolvedor Frontend</td></tr>
  <tr><td><strong>Tipo</strong></td><td>Sucesso</td></tr>
  <tr><td><strong>Requisitos</strong></td><td>RF-003</td></tr>
  <tr><td><strong>Passos</strong></td><td>
1. Clicar “+ Nova Tarefa”.<br>
2. Preencher título, descrição, projeto e prioridade.<br>
3. Clicar em “Salvar”.<br>
4. Verificar toast de sucesso e nova tarefa no Kanban.
</td></tr>
  <tr><td><strong>Dados</strong></td><td>Título: “Implementar login”<br>Descrição: “Tela inicial de login”<br>Status: TODO</td></tr>
  <tr><td><strong>Critério</strong></td><td>Tarefa criada e exibida na coluna correspondente.</td></tr>
</table>
```

### CT-004-S – Mover tarefa entre colunas

```
<table>
  <tr><th colspan="2">CT-004-S<br>Movimentação de tarefa entre colunas</th></tr>
  <tr><td><strong>Descrição</strong></td><td>Verificar que o drag-and-drop atualiza o status corretamente.</td></tr>
  <tr><td><strong>Responsável</strong></td><td>QA</td></tr>
  <tr><td><strong>Tipo</strong></td><td>Sucesso</td></tr>
  <tr><td><strong>Requisitos</strong></td><td>RF-004</td></tr>
  <tr><td><strong>Passos</strong></td><td>
1. Selecionar tarefa da coluna “A Fazer”.<br>
2. Arrastar para “Em Progresso”.<br>
3. Soltar e aguardar atualização.<br>
4. Recarregar a página e confirmar persistência do status.
</td></tr>
  <tr><td><strong>Dados</strong></td><td>Tarefa: “Implementar login”.</td></tr>
  <tr><td><strong>Critério</strong></td><td>Status salvo e refletido corretamente no backend.</td></tr>
</table>
```

### CT-005-S – Edição de tarefa existente

```
<table>
  <tr><th colspan="2">CT-005-S<br>Edição de tarefa existente</th></tr>
  <tr><td><strong>Descrição</strong></td><td>Validar atualização de informações de uma tarefa via modal de edição.</td></tr>
  <tr><td><strong>Responsável</strong></td><td>Desenvolvedor Frontend</td></tr>
  <tr><td><strong>Tipo</strong></td><td>Sucesso</td></tr>
  <tr><td><strong>Requisitos</strong></td><td>RF-003</td></tr>
  <tr><td><strong>Passos</strong></td><td>
1. Clicar em uma tarefa.<br>
2. No modal, clicar “Editar”.<br>
3. Alterar o título e prioridade.<br>
4. Clicar “Salvar”.<br>
5. Verificar toast de sucesso.
</td></tr>
  <tr><td><strong>Dados</strong></td><td>Título novo: “Login (refatorado)”.</td></tr>
  <tr><td><strong>Critério</strong></td><td>Tarefa atualizada e refletida na tela.</td></tr>
</table>
```

### CT-006-S – Exclusão de tarefa

```
<table>
  <tr><th colspan="2">CT-006-S<br>Exclusão de tarefa</th></tr>
  <tr><td><strong>Descrição</strong></td><td>Garantir que a exclusão remove a tarefa e apresenta feedback ao usuário.</td></tr>
  <tr><td><strong>Responsável</strong></td><td>QA</td></tr>
  <tr><td><strong>Tipo</strong></td><td>Sucesso</td></tr>
  <tr><td><strong>Requisitos</strong></td><td>RF-003</td></tr>
  <tr><td><strong>Passos</strong></td><td>
1. Clicar em uma tarefa.<br>
2. No modal, clicar “Excluir”.<br>
3. Confirmar a ação.<br>
4. Verificar toast de sucesso e remoção da tarefa.
</td></tr>
  <tr><td><strong>Critério</strong></td><td>Tarefa não mais exibida após exclusão.</td></tr>
</table>
```

---

## Casos de Teste de **Insucesso**

### CT-009-I01 – Criação com campos obrigatórios vazios

```
<table>
  <tr><th colspan="2">CT-009-I01<br>Criação de tarefa com campos obrigatórios vazios</th></tr>
  <tr><td><strong>Descrição</strong></td><td>Testar validação de formulário de criação de tarefa.</td></tr>
  <tr><td><strong>Tipo</strong></td><td>Insucesso</td></tr>
  <tr><td><strong>Requisito</strong></td><td>RF-003</td></tr>
  <tr><td><strong>Passos</strong></td><td>
1. Abrir modal “+ Nova Tarefa”.<br>
2. Deixar título e projeto vazios.<br>
3. Clicar em “Salvar”.
</td></tr>
  <tr><td><strong>Critério</strong></td><td>Toast de erro “Não foi possível criar a tarefa.” exibido; modal não fecha.</td></tr>
</table>
```

### CT-010-I01 – Falha ao mover tarefa

```
<table>
  <tr><th colspan="2">CT-010-I01<br>Falha ao mover tarefa (erro no backend)</th></tr>
  <tr><td><strong>Descrição</strong></td><td>Simular erro de rede na mudança de status.</td></tr>
  <tr><td><strong>Tipo</strong></td><td>Insucesso</td></tr>
  <tr><td><strong>Requisito</strong></td><td>RF-004</td></tr>
  <tr><td><strong>Passos</strong></td><td>
1. Arrastar tarefa de “A Fazer” para “Revisão”.<br>
2. Backend retorna 500.<br>
3. Observar comportamento da UI.
</td></tr>
  <tr><td><strong>Critério</strong></td><td>Toast “Falha ao mover tarefa. Voltando ao estado anterior.” e tarefa retorna ao status original.</td></tr>
</table>
```

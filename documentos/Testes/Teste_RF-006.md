# Planos de Testes de Software – **Página de Relatórios**

| ID             | Requisito | Descrição do Caso de Teste                                  | Entrada de Dados                                                 | Resultado Esperado                                                                                    | Prioridade |
| -------------- | --------- | ----------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------- |
| **CT-001-S**   | RF-009    | Exibição correta dos filtros (Projeto e Período)            | –                                                                | Select de **Projeto** (inclui “Todos os projetos”) e select de **Período** (Hoje/Semana/Mês) visíveis | Alta       |
| **CT-002-S**   | RF-010    | Carregamento do **Resumo** (cards de métricas)              | Projeto: “Todos” · Período: “Hoje”                               | Cards (Produtividade, Eficiência, Em Progresso, Atrasadas) exibidos com valores do serviço            | Alta       |
| **CT-003-S**   | RF-006    | Aplicar **filtro por Projeto** e atualizar resumo           | Projeto “Empresa A” · Período “Hoje”                             | Resumo e distribuição por prioridade atualizados considerando apenas “Empresa A”                      | Alta       |
| **CT-004-S**   | RF-006    | Aplicar **filtro por Período** (Hoje/Semana/Mês)            | Alternar Período: Hoje → Semana → Mês                            | Cada troca dispara nova busca; cards refletem os dados do período selecionado                         | Alta       |
| **CT-005-S**   | RF-005    | **Gerar relatório por IA** e exibir **modal** com preview   | Projeto opcional · Período selecionado                           | Toast de sucesso; modal abre com HTML retornado (preview renderizado)                                 | Alta       |
| **CT-006-S**   | RF-007    | **Salvar .HTML** do relatório a partir do modal             | HTML carregado no modal                                          | Download de arquivo `\<period\>-ia-YYYY-MM-DD.html` com o conteúdo exibido                            | Alta       |
| **CT-007-S**   | RF-007    | **Imprimir / Salvar PDF** a partir do modal                 | HTML carregado no modal                                          | Janela de impressão do navegador aberta com o conteúdo do relatório                                   | Alta       |
| **CT-008-S**   | RF-010    | Exibição da **distribuição por prioridade** (gráfico/lista) | Projeto: “Todos” · Período: “Semana”                             | Distribuição por prioridade é exibida e soma coerente com total do período                            | Média      |
| **CT-001-I01** | RF-005    | Falha na **geração por IA** (erro do serviço)               | Clique em “+ Relatório”; serviço retorna 500                     | Toast de erro; **modal não abre**; app permanece estável                                              | Alta       |
| **CT-002-I01** | RF-006    | Falha ao **carregar resumo** (timeout/500)                  | Alterar filtros; serviço de resumo falha                         | Loading encerra; sem crash; valores anteriores mantidos ou estado neutro; mensagem/indicador de erro  | Alta       |
| **CT-003-I01** | RF-009    | **Troca rápida** de filtros (condição de corrida)           | Alternar Projeto/Período várias vezes em < 2s                    | Última seleção “vence”; UI não fica inconsistente (sem piscar dados defasados)                        | Média      |
| **CT-004-I01** | RF-007    | **Popup de impressão bloqueado** pelo navegador             | Clicar “Imprimir / Salvar PDF” com bloqueio de popups            | Sem crash; apenas não abre a janela; UI segue funcional                                               | Média      |
| **CT-005-I01** | RF-005    | **HTML malformado**/tags incomuns no preview da IA          | IA retorna HTML com `<style>`, tabelas e tags aninhadas atípicas | Modal continua renderizando; impressão funciona; sem quebra de layout grave                           | Média      |

---

## Casos de Teste de **Sucesso**

### CT-001-S – Exibição correta dos filtros

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-001-S<br>Exibição correta dos filtros (Projeto e Período)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Validar que os filtros de Projeto e Período são renderizados e estão acessíveis.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-009: Filtros/visões por empresa/label e período.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de Relatórios (/reports).<br>
      2. Verificar presença do select "Projeto" com opção "Todos os projetos".<br>
      3. Verificar presença do select "Período" com opções Hoje/Semana/Mês.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica – teste de interface.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Ambos selects visíveis, habilitados e acessíveis (tabindex/aria-label ok).</td>
  </tr>
</table>
```

### CT-002-S – Carregamento do Resumo (cards)

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-002-S<br>Carregamento do Resumo (cards de métricas)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar exibição dos cards com dados do serviço de resumo no período atual.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>QA / Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-010: Dashboard de métricas (resumo por período).</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar /reports com Período "Hoje".<br>
      2. Aguardar término do loading.<br>
      3. Validar que os cards mostram os valores retornados (Produtividade, Eficiência, Em Progresso, Atrasadas).
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Mock do serviço de resumo com valores conhecidos (ex.: 75%, 1.2h, 3, 1).</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Cards exibem exatamente os números do mock; sem erros na UI.</td>
  </tr>
</table>
```

### CT-003-S – Filtro por Projeto

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-003-S<br>Aplicar filtro por Projeto e atualizar resumo</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Garantir que selecionar um projeto específico reflete no resumo e na distribuição por prioridade.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>QA / Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-006 e RF-009.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar "Empresa A" no filtro de Projeto.<br>
      2. Confirmar nova chamada ao serviço com <code>projectId</code> de "Empresa A".<br>
      3. Validar que cards e distribuição por prioridade refletem somente dados da Empresa A.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Dois projetos com respostas distintas no mock.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Métricas atualizadas e coerentes com o projeto selecionado.</td>
  </tr>
</table>
```

### CT-004-S – Filtro por Período

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-004-S<br>Aplicar filtro por Período (Hoje/Semana/Mês)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Checar que cada período dispara nova busca e altera corretamente as métricas exibidas.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>QA / Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-006 (período) e RF-010 (métricas por período).</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Alternar Período de "Hoje" para "Semana" e depois "Mês".<br>
      2. Verificar que cada troca realiza chamada com <code>period</code> correto.<br>
      3. Conferir atualização dos valores nos cards.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Mocks distintos por período (valores diferentes).</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>UI reflete fielmente os dados de cada período selecionado.</td>
  </tr>
</table>
```

### CT-005-S – Gerar relatório por IA (modal)

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-005-S<br>Gerar relatório por IA e exibir modal com preview</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Validar o fluxo completo de geração por IA com abertura do modal e renderização do HTML retornado.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-005 e RF-006.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar Projeto/Período.<br>
      2. Clicar em “+ Relatório”.<br>
      3. Confirmar chamada ao serviço com parâmetros corretos.<br>
      4. Verificar toast de sucesso e modal com preview do HTML retornado.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Mock retorna <code>{ html: "&lt;h1&gt;Relatório&lt;/h1&gt;&lt;p&gt;Conteúdo...&lt;/p&gt;" }</code>.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Modal aberto e preview renderizado sem erros.</td>
  </tr>
</table>
```

### CT-006-S – Salvar .HTML

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-006-S<br>Salvar .HTML do relatório a partir do modal</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Checar que o arquivo baixado contém o HTML do relatório e segue o padrão de nome esperado.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>QA / Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007: Exportação de relatórios.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Com o modal aberto e HTML carregado, clicar em “Salvar .HTML”.<br>
      2. Verificar nome e conteúdo do arquivo baixado.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>HTML simples retornado pela IA.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Arquivo <code>&lt;period&gt;-ia-YYYY-MM-DD.html</code> baixado com conteúdo idêntico ao preview.</td>
  </tr>
</table>
```

### CT-007-S – Imprimir / Salvar PDF

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-007-S<br>Imprimir / Salvar PDF a partir do modal</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Ação abre a janela de impressão do navegador com o relatório renderizado para impressão/salvamento em PDF.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>QA</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Com o modal aberto, clicar “Imprimir / Salvar PDF”.<br>
      2. Verificar abertura do diálogo de impressão com conteúdo do relatório.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>HTML em preview no modal.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Janela de impressão aberta com o conteúdo exibido corretamente.</td>
  </tr>
</table>
```

### CT-008-S – Distribuição por prioridade

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-008-S<br>Exibição da distribuição por prioridade</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Validar que a distribuição por prioridade é apresentada e consistente com o total do período.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>QA</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-010.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar Período "Semana".<br>
      2. Aguardar carregamento da distribuição.<br>
      3. Validar soma por prioridade vs. total exibido nos cards.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Mock com totais por prioridade conhecidos.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Soma das prioridades condiz com o total; UI correta.</td>
  </tr>
</table>
```

---

## Casos de Teste de **Insucesso**

### CT-001-I01 – Falha na geração por IA

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-001-I01<br>Falha na geração por IA (erro do serviço)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Tratar erro 500/timeout na geração do relatório por IA ao clicar em “+ Relatório”.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>QA</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-005; RF-006.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>1. Simular erro 500 no serviço de IA.<br>2. Clicar em “+ Relatório”.<br>3. Observar feedback da interface.</td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Mock de rejeição no endpoint de IA.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Toast de erro exibido; modal <strong>não</strong> abre; sem travamentos.</td>
  </tr>
</table>
```

### CT-002-I01 – Falha ao carregar resumo

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-002-I01<br>Falha ao carregar resumo (dashboard)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Garantir robustez quando a busca do resumo falha por erro do servidor ou timeout.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>QA</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-006; RF-010.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>1. Simular timeout/500 no serviço de resumo.<br>2. Alterar filtros para disparar a requisição.<br>3. Ver observabilidade do erro e estado final da UI.</td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Mock de erro no serviço de resumo.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Sem crash; loading encerra; UI permanece utilizável; mensagem/indicador de erro quando aplicável.</td>
  </tr>
</table>
```

### CT-003-I01 – Troca rápida de filtros (condição de corrida)

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-003-I01<br>Troca rápida de filtros (condição de corrida)</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Validar que múltiplas requisições concorrentes não deixam a UI inconsistente; a última seleção prevalece.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>QA</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-009; RF-010.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>1. Alternar Projeto/Período rapidamente (&lt;2s).<br>2. Simular respostas com tempos variados.<br>3. Verificar estado final da UI = última seleção.</td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Mocks com latências diferentes.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>A UI não exibe dados “antigos”; última resposta aplicada é a última seleção do usuário.</td>
  </tr>
</table>
```

### CT-004-I01 – Popup de impressão bloqueado

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-004-I01<br>Popup de impressão bloqueado pelo navegador</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Assegurar que o bloqueio de popups não causa erros na aplicação ao tentar imprimir o relatório.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>QA</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>1. Ativar bloqueio de popups no navegador.<br>2. No modal, clicar “Imprimir / Salvar PDF”.</td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Configuração de browser com bloqueio ativo.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Nenhum crash; operação apenas não abre a janela de impressão.</td>
  </tr>
</table>
```

### CT-005-I01 – HTML malformado no preview

```
<table>
  <tr>
    <th colspan="2" width="1000">CT-005-I01<br>HTML malformado no preview da IA</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Garantir que HTML com tags incomuns ou aninhamento estranho não quebre o modal nem a impressão.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>QA</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-005; RF-007.</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Simular retorno com &lt;style&gt;, tabelas grandes e tags aninhadas.<br>
      2. Abrir modal e visualizar preview.<br>
      3. Tentar imprimir.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>HTML complexo e parcialmente malformado.</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Preview carrega; impressão abre; UI permanece funcional (sem travamentos).</td>
  </tr>
</table>
```

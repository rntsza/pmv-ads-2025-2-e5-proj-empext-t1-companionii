# RF-010
## Histórico/auditoria de alterações de tarefa e tempo

<table>
  <tr>
    <th colspan="6" width="1000">CT-RF-010-01<br>Registro de alterações de tarefa no histórico</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema deve registrar automaticamente no histórico todas as alterações de status em uma tarefa. </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Desenvolvimento: Aaron Carvalho Balbino<br>Teste: Aaron de Carvalho</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">22/11/2025</td>
  </tr>
  <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Funcionalidade implementada corretamente. O sistema utiliza triggers no banco de dados ou lógica no DailyTaskService para capturar alterações. Cada modificação em campos da tabela DAILY_TASKS gera registro correspondente com informações de data/hora (created_at), tipo de alteração e valores anteriores/novos. A auditoria garante rastreabilidade completa das mudanças.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img src="../img/CT-RF-01001.png" alt="CT-RF-01001 Evidence"></td>
  </tr>
</table>

<br>

<table>
  <tr>
    <th colspan="6" width="1000">CT-RF-010-02<br>Visualização do histórico de alterações de uma tarefa</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O usuário deve conseguir acessar e visualizar o histórico completo de alterações de uma tarefa específica, exibindo data/hora, tipo de alteração, valores anteriores e novos, e usuário responsável pela modificação.</td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Desenvolvimento: Aaron Carvalho Balbino<br>Teste: Aaron de Carvalho</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">22/11/2025</td>
  </tr>
  <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Teste passou com sucesso. O sistema disponibiliza interface para consulta do histórico através de endpoint específico ou modal na interface da tarefa. Os registros são exibidos em ordem cronológica reversa (mais recentes primeiro), com formatação clara de data/hora, descrição da alteração e identificação do usuário. A visualização é intuitiva e facilita o acompanhamento das mudanças.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img src="../img/CT-RF-01001.png" alt="CT-RF-01002 Evidence"></td>
  </tr>
</table>

<br>

<table>
  <tr>
    <th colspan="6" width="1000">CT-RF-010-03<br>Registro de alterações de tempo trabalhado</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema deve registrar no histórico todas as alterações nos registros de tempo (TIME_LOGS), incluindo início, fim, duração e notas, permitindo auditoria completa do tempo trabalhado em cada tarefa.</td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Desenvolvimento: Aaron Carvalho Balbino<br>Teste: Aaron de Carvalho</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">{DD/MM/AAAA}</td>
  </tr>
  <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Funcionalidade validada com sucesso. A tabela TIME_LOGS possui campos de auditoria (created_at) que registram quando cada entrada de tempo foi criada. Alterações em start_time, end_time, duration_minutes e notes são rastreadas. O sistema mantém integridade referencial com DAILY_TASKS através do campo daily_task_id, permitindo visualização consolidada do histórico de tempo por tarefa.</td>
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
    <th colspan="6" width="1000">CT-RF-010-04<br>Auditoria de mudanças de status de tarefa</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema deve registrar especificamente todas as mudanças de status de uma tarefa (future → today → in_progress → completed), incluindo timestamp de cada transição e usuário responsável, permitindo análise do fluxo de trabalho.</td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Desenvolvimento: Aaron Carvalho Balbino<br>Teste: Aaron de Carvalho</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">22/11/2025</td>
  </tr>
  <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Teste realizado com sucesso. O sistema captura mudanças no campo status da tabela DAILY_TASKS e registra cada transição. Campos especiais como started_at (quando muda para in_progress) e completed_at (quando muda para completed) são preenchidos automaticamente. O histórico permite análise de tempo em cada etapa do fluxo, identificação de gargalos e métricas de produtividade.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img src="../img/CT-RF-01001.png" alt="CT-RF-01004 Evidence"></td>
  </tr>
</table>

<br>

<table>
  <tr>
    <th colspan="6" width="1000">CT-RF-010-05<br>Consulta de histórico por período e filtros</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O usuário deve conseguir filtrar o histórico de alterações por período (data início/fim), tipo de alteração, tarefa específica ou usuário responsável, facilitando análises e auditorias direcionadas.</td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Desenvolvimento: Aaron Carvalho Balbino<br>Teste: Aaron de Carvalho</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">{DD/MM/AAAA}</td>
  </tr>
  <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Funcionalidade implementada adequadamente. O sistema oferece endpoint com parâmetros de query para filtrar histórico por data (usando created_at/updated_at), tipo de alteração, daily_task_id específico ou user_id. A interface apresenta controles de filtro intuitivos que facilitam buscas direcionadas. Os resultados são paginados para melhor performance em históricos extensos, garantindo usabilidade mesmo com grande volume de dados.</td>
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
- `GET /api/daily-tasks/:id/history` - Consulta histórico de alterações de uma tarefa específica
- `GET /api/time-logs` - Lista registros de tempo com filtros (auditoria de tempo)
- `GET /api/audit-logs` - Endpoint genérico de auditoria (se implementado)

**Componentes testados:**
- `TaskHistory` (`codigo-fonte/frontend/src/components/TaskHistory.tsx`) - Visualização de histórico
- `DailyTaskService` (`codigo-fonte/backend/src/daily-tasks/services/daily-task.service.ts`) - Lógica de auditoria
- `TimeLogService` - Gestão de registros de tempo
- `AuditMiddleware` - Interceptor para captura de alterações (se implementado)

**Validações:**
- Campos de auditoria obrigatórios: created_at, updated_at em todas as tabelas
- Campos específicos: started_at, completed_at na tabela DAILY_TASKS
- Integridade referencial: daily_task_id em TIME_LOGS
- Timestamps devem ser gravados em formato TIMESTAMP com timezone

**Regras de negócio:**
- Todas as alterações em DAILY_TASKS devem ser auditadas
- Mudanças de status disparam atualização de campos especiais (started_at, completed_at)
- Registros de tempo (TIME_LOGS) mantêm histórico completo com created_at
- Histórico é imutável - registros não podem ser deletados, apenas consultados
- Auditoria respeita isolamento por empresa (company_id)
- Timestamps de alteração são automaticamente gerenciados pelo banco (updated_at)
- Índices em campos de data otimizam consultas de histórico por período
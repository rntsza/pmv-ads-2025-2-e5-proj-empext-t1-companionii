# Planos de Testes de Software - Módulo de Autenticação

| ID          | Requisito | Descrição do Caso de Teste                              | Entrada de Dados                                  | Resultado Esperado                                                       | Prioridade |
|------------|-----------|--------------------------------------------------------|-------------------------------------------------|-------------------------------------------------------------------------|------------|
| CT-001-S   | RF-001    | Exibição correta do formulário de login               | Não se aplica - teste de interface             | Todos os elementos da interface devem estar visíveis e acessíveis       | Alta       |
| CT-002-S   | RF-002    | Toggle de visibilidade da senha                       | Senha: password123                              | O campo deve alternar entre ocultar e mostrar a senha conforme clicado  | Alta       |
| CT-003-S   | RF-003    | Navegação para página de cadastro                     | Não se aplica                                   | Usuário deve ser redirecionado para a página de registro                | Média      |
| CT-004-S   | RF-004    | Navegação para página de recuperação de senha        | Não se aplica                                   | Usuário deve ser redirecionado para a página de recuperação de senha    | Média      |
| CT-005-S   | RF-005    | Exibição do formulário de registro                    | Não se aplica - teste de interface             | Todos os elementos da interface devem estar visíveis e acessíveis       | Alta       |
| CT-006-S   | RF-006    | Indicador de força da senha                            | Senha fraca: weak<br>Senha forte: StrongPassword123! | Indicador deve mostrar "Weak" para senhas fracas e "Strong" para fortes | Alta       |
| CT-007-S   | RF-007    | Exibição do formulário de recuperação de senha       | Não se aplica - teste de interface             | Todos os elementos da interface devem estar visíveis e acessíveis       | Alta       |
| CT-008-S   | RF-008    | Acesso ao dashboard com autenticação válida          | Email: admin@local.com<br>Senha: admin123      | Usuário deve acessar o dashboard e ver "Bem-vindo ao Companion"         | Alta       |
| CT-001-I01 | RF-009    | Validação de campos obrigatórios no login            | Campos vazios                                   | Sistema deve exibir mensagem "obrigatório" e manter usuário na página   | Alta       |
| CT-002-I01 | RF-010    | Validação de formato de email no login               | Email: invalid-email                            | Sistema deve impedir envio do formulário e manter usuário na página     | Alta       |
| CT-003-I01 | RF-011    | Validação de tamanho mínimo da senha no login        | Email: test@example.com<br>Senha: 123          | Sistema deve impedir envio do formulário e manter usuário na página     | Alta       |
| CT-004-I01 | RF-012    | Validação de confirmação de senha no registro       | Nome: John Doe<br>Email: john@example.com<br>Senha: password123<br>Confirmação: different | Sistema deve impedir envio do formulário e manter usuário na página     | Alta       |
| CT-005-I01 | RF-013    | Validação de aceitação de termos no registro        | Nome: John Doe<br>Email: john@example.com<br>Senha: password123<br>Confirmação: password123<br>Termos: não marcado | Sistema deve impedir envio do formulário e manter usuário na página     | Alta       |
| CT-006-I01 | RF-014    | Validação de email no formulário de recuperação de senha | Email vazio: ""<br>Email inválido: invalid-email | Sistema deve impedir envio do formulário nos dois cenários e manter usuário na página | Alta       |
| CT-007-I01 | RF-015    | Redirecionamento de usuário não autenticado         | Usuário sem autenticação                        | Sistema deve redirecionar automaticamente para /login                  | Alta       |
| CT-008-S   | RF-016    | Compatibilidade com diferentes dispositivos         | Diferentes resoluções de tela                    | Todos os elementos devem estar visíveis e funcionais em todas as resoluções | Média      |
| CT-009-S   | RNF-001   | Tempo de carregamento da página de login            | Medição de performance                           | Página deve carregar em menos de 3 segundos                             | Média      |

## Casos de Teste de Sucesso

### CT-001-S - Exibição correta do formulário de login
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-001-S<br>Exibição correta do formulário de login</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se todos os elementos do formulário de login são exibidos corretamente</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-001: Interface de login deve ser intuitiva e funcional</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de login (/login)<br>
      2. Verificar presença do título "Acesse a sua conta"<br>
      3. Verificar campo de email com placeholder "Digite seu email"<br>
      4. Verificar campo de senha com placeholder "Digite sua senha"<br>
      5. Verificar botão "Entrar"<br>
      6. Verificar botão "Continuar com Google"
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica - teste de interface</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Todos os elementos da interface devem estar visíveis e acessíveis</td>
  </tr>
</table>
```

### CT-002-S - Toggle de visibilidade da senha
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-002-S<br>Toggle de visibilidade da senha</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se o usuário pode alternar entre mostrar e ocultar a senha</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-002: Campo de senha deve permitir visualização do texto digitado</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de login<br>
      2. Digitar uma senha no campo correspondente<br>
      3. Verificar que o campo está como type="password"<br>
      4. Clicar no botão de toggle (ícone de olho)<br>
      5. Verificar que o campo mudou para type="text"
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Senha: password123</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O campo deve alternar entre ocultar e mostrar a senha conforme clicado</td>
  </tr>
</table>
```

### CT-003-S - Navegação para página de cadastro
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-003-S<br>Navegação para página de cadastro</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se o link "Cadastre-se" redireciona corretamente para a página de registro</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-003: Sistema deve permitir navegação entre páginas de autenticação</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de login<br>
      2. Clicar no link "Cadastre-se"<br>
      3. Verificar redirecionamento para /register
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Usuário deve ser redirecionado para a página de registro</td>
  </tr>
</table>
```

### CT-004-S - Navegação para página de esqueci minha senha
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-004-S<br>Navegação para página de esqueci minha senha</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se o link "Esqueceu a senha?" redireciona corretamente</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-004: Sistema deve permitir recuperação de senha</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de login<br>
      2. Clicar no link "Esqueceu a senha?"<br>
      3. Verificar redirecionamento para /forgot-password
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Usuário deve ser redirecionado para a página de recuperação de senha</td>
  </tr>
</table>
```

### CT-005-S - Exibição do formulário de registro
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-005-S<br>Exibição do formulário de registro</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se todos os elementos do formulário de registro são exibidos corretamente</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-005: Interface de registro deve ser completa e intuitiva</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de registro (/register)<br>
      2. Verificar presença do título "Crie sua conta"<br>
      3. Verificar campo nome com placeholder "Digite seu nome completo"<br>
      4. Verificar campo email com placeholder "Digite seu email"<br>
      5. Verificar campo senha com placeholder "Crie uma senha"<br>
      6. Verificar campo confirmação com placeholder "Confirme sua senha"<br>
      7. Verificar checkbox de termos de uso
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica - teste de interface</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Todos os elementos da interface devem estar visíveis e acessíveis</td>
  </tr>
</table>
```

### CT-006-S - Indicador de força da senha
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-006-S<br>Indicador de força da senha</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se o indicador de força da senha funciona corretamente</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-006: Sistema deve indicar força da senha em tempo real</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de registro<br>
      2. Digitar senha fraca no campo senha<br>
      3. Verificar indicador "Weak"<br>
      4. Limpar campo e digitar senha forte<br>
      5. Verificar indicador "Strong"
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      Senha fraca: weak<br>
      Senha forte: StrongPassword123!
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Indicador deve mostrar "Weak" para senhas fracas e "Strong" para senhas fortes</td>
  </tr>
</table>
```

### CT-007-S - Exibição do formulário de recuperação de senha
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-007-S<br>Exibição do formulário de recuperação de senha</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se o formulário de recuperação de senha é exibido corretamente</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007: Interface de recuperação de senha deve ser clara e funcional</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de recuperação (/forgot-password)<br>
      2. Verificar presença do título "Redefinir sua senha"<br>
      3. Verificar campo email com placeholder "Digite seu email"<br>
      4. Verificar botão "Enviar link de redefinição"
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Não se aplica - teste de interface</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Todos os elementos da interface devem estar visíveis e acessíveis</td>
  </tr>
</table>
```

### CT-008-S - Acesso ao dashboard com autenticação válida
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-008-S<br>Acesso ao dashboard com autenticação válida</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se usuário autenticado consegue acessar o dashboard</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Backend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-008: Sistema deve permitir acesso a páginas protegidas quando autenticado</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Fazer login com credenciais válidas<br>
      2. Acessar /dashboard<br>
      3. Verificar exibição da mensagem de boas-vindas
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      Email: admin@local.com<br>
      Senha: admin123
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Usuário deve acessar o dashboard e ver "Bem-vindo ao Companion"</td>
  </tr>
</table>
```

## Casos de Teste de Insucesso
```
### CT-001-I01 - Validação de campos obrigatórios no login
<table>
  <tr>
    <th colspan="2" width="1000">CT-001-I01<br>Validação de campos obrigatórios no login</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se o sistema valida campos obrigatórios no formulário de login</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-009: Sistema deve validar campos obrigatórios</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de login<br>
      2. Deixar campos email e senha em branco<br>
      3. Clicar no botão "Entrar"<br>
      4. Verificar que formulário não é enviado
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Campos vazios</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Sistema deve exibir mensagem "obrigatório" e manter usuário na página de login</td>
  </tr>
</table>
```

### CT-002-I01 - Validação de formato de email no login
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-002-I01<br>Validação de formato de email no login</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se o sistema valida o formato do email no login</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-010: Sistema deve validar formato de email</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de login<br>
      2. Digitar email inválido<br>
      3. Clicar no botão "Entrar"<br>
      4. Verificar que formulário não é enviado
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Email: invalid-email</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Sistema deve impedir envio do formulário e manter usuário na página de login</td>
  </tr>
</table>
```

### CT-003-I01 - Validação de tamanho mínimo da senha no login
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-003-I01<br>Validação de tamanho mínimo da senha no login</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se o sistema valida o tamanho mínimo da senha</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-011: Sistema deve validar tamanho mínimo da senha</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de login<br>
      2. Digitar email válido<br>
      3. Digitar senha muito curta<br>
      4. Clicar no botão "Entrar"<br>
      5. Verificar que formulário não é enviado
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      Email: test@example.com<br>
      Senha: 123
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Sistema deve impedir envio do formulário e manter usuário na página de login</td>
  </tr>
</table>
```

### CT-004-I01 - Validação de confirmação de senha no registro
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-004-I01<br>Validação de confirmação de senha no registro</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se o sistema valida se as senhas coincidem no registro</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-012: Sistema deve validar confirmação de senha</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de registro<br>
      2. Preencher nome completo<br>
      3. Preencher email válido<br>
      4. Digitar senha<br>
      5. Digitar confirmação diferente da senha<br>
      6. Marcar checkbox de termos<br>
      7. Clicar em "Cadastrar"
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      Nome: John Doe<br>
      Email: john@example.com<br>
      Senha: password123<br>
      Confirmação: different
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Sistema deve impedir envio do formulário e manter usuário na página de registro</td>
  </tr>
</table>
```

### CT-005-I01 - Validação de aceitação de termos no registro
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-005-I01<br>Validação de aceitação de termos no registro</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se o sistema exige aceitação dos termos para registro</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-013: Sistema deve exigir aceitação dos termos de uso</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de registro<br>
      2. Preencher todos os campos corretamente<br>
      3. Deixar checkbox de termos desmarcado<br>
      4. Clicar em "Cadastrar"
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      Nome: John Doe<br>
      Email: john@example.com<br>
      Senha: password123<br>
      Confirmação: password123<br>
      Termos: não marcado
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Sistema deve impedir envio do formulário e manter usuário na página de registro</td>
  </tr>
</table>
```

### CT-006-I01 - Validação de email no formulário de recuperação de senha
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-006-I01<br>Validação de email no formulário de recuperação de senha</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar validação de email na página de recuperação de senha</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-014: Sistema deve validar email na recuperação de senha</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de recuperação de senha<br>
      2. Deixar campo email vazio<br>
      3. Clicar em "Enviar link de redefinição"<br>
      4. Verificar que não foi enviado<br>
      5. Digitar email inválido<br>
      6. Clicar em "Enviar link de redefinição"<br>
      7. Verificar que não foi enviado
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      Email vazio: ""<br>
      Email inválido: invalid-email
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Sistema deve impedir envio do formulário nos dois cenários e manter usuário na página</td>
  </tr>
</table>
```

### CT-007-I01 - Redirecionamento de usuário não autenticado
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-007-I01<br>Redirecionamento de usuário não autenticado</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se usuários não autenticados são redirecionados para login</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Backend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-015: Sistema deve proteger rotas que exigem autenticação</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Limpar estado de autenticação<br>
      2. Tentar acessar /dashboard diretamente<br>
      3. Verificar redirecionamento
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Usuário sem autenticação</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Sistema deve redirecionar automaticamente para /login</td>
  </tr>
</table>
```

## Testes de Responsividade

### CT-008-S - Compatibilidade com diferentes dispositivos
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-008-S<br>Compatibilidade com diferentes dispositivos</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se a interface funciona corretamente em diferentes tamanhos de tela</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-016: Interface deve ser responsiva</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de login<br>
      2. Testar em resolução 375x667 (iPhone SE)<br>
      3. Testar em resolução 768x1024 (iPad)<br>
      4. Testar em resolução 1024x768 (Desktop)<br>
      5. Verificar visibilidade dos elementos em cada resolução
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Diferentes resoluções de tela</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Todos os elementos devem estar visíveis e funcionais em todas as resoluções testadas</td>
  </tr>
</table>
```

## Testes de Performance

### CT-009-S - Tempo de carregamento da página de login
```
<table>
  <tr>
    <th colspan="2" width="1000">CT-009-S<br>Tempo de carregamento da página de login</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verificar se a página de login carrega em tempo aceitável</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td width="430">Desenvolvedor Frontend</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RNF-001: Aplicação deve ter tempo de resposta adequado</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a página de login<br>
      2. Medir tempo de carregamento completo<br>
      3. Verificar se está dentro do limite aceitável
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>Medição de performance</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Página deve carregar em menos de 3 segundos</td>
  </tr>
</table>
```

### Demonstração em Vídeo

![Demonstração dos Testes de Autenticação](../img/video_RF-001.mov)

> **Nota:** [clique aqui para abrir o arquivo](../img/video_RF-001.mov)

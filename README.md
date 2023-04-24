```
describe('', () => {
  it('', () => {

  })
})

```

## tsconfig.json

```
{
  "compilerOptions": {
    "target": "ES2021",
  },
}
```

Esta opção diz em qual versão o nosso código typescript sera compilado. Caso não informado existe uma opção default.

```
{
  "compilerOptions": {
    "moduleResolution": "node",
  },
}
```

Serve para fazer o importe diretamente da pastas pois vai entender que dentra da pasta existe um arquivo index.

```
{
  "compilerOptions": {
    "module": "commonjs",
  },
}
```

Converte os imports para required ao compilar.

```
{
  "compilerOptions": {
    "esModuleInterop": "true",
  },
}
```

?

```
{
  "compilerOptions": {
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true, // Garante que as propriedades de uma clase sempre vão estar inicializadas.
    "noImplicitAny": true // Não deixa que nenhuma variavel seja criada sem tipo
  },
}
```

?

## ES Module

## Command Pattern
## Factory Method
## Intersection Types

Entities -> Enterprise Business Rules - Regras de Negócios Corporativos
UseCases -> Application Business Rules - Regras de negócios do aplicativo
Controllers - Gateways - Presenters -> Interface Adapters - Adaptadores de interface
Web - DB - UI - External Interfaces - Devices -> Frameworks & Drivers

Entities -> Domain

Núcleo do sistema. Regras de negócio que não mudam dependendo do contexto. O contexto é o use case de login com o facebook.
Ao fazer login aplicamos a regra.

Até agora criamos um entidade que tem uma regra de negócio que é o facebook account. e foi definido que se a conta do usuário
não tiver nome é pra atualizar com o nome do facebook se não não é para atualizar. Essa é uma regra que pertence ao facebook account. E isso não muda se mudar o contexto? o contexto que estamos usando esta entidade hoje é o caso de uso de login com facebook. Ao fazer login aplicamos a regra de negócio.

UseCases -> Data

Controllers -> Apllication, Infra

Entities: Regras de negócio que não mudam dependendo do contexto.
Entidade = FacebookAccount

Definido que se o usuário não tiver nome ela atualizada se não não atualiza. Essa regra pertence a conta do facebook.
Está regra não muda se mudar o contexto.
Contexto é o caso de uso que é o login com facebook

A pasta models ou entities que contem o arquivo facebook-account.ts é a entidade.

value-object <-> DDD -> è um objeto que não tem identidade, ele não muda o estado dele, oque o representa é o seu valor (nos parametros dessa classe). Arquito access-token.ts na pasta models ou entities.

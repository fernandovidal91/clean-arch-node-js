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

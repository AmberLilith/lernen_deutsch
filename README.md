# Alemão · Estudos

Material estático em HTML/CSS/JS puro para organizar o estudo de alemão.

## Estrutura

- `index.html` — índice geral
- `paginas/` — explicações por conteúdo
- `exercicios/` — atividades corrigidas por JavaScript
- `css/style.css` — estilo compartilhado
- `js/app.js` — correção e interação

## Conteúdos incluídos nesta versão

Fundamentos, gênero dos substantivos, artigos definidos e indefinidos, quatro casos, negação (`nicht`/`kein`), pronomes pessoais, presente regular, presente irregular, modais, verbos separáveis, Perfekt, ordem das palavras, subordinadas, preposições, Wechselpräpositionen, Dativ, n-Deklination, adjetivos, vocabulário e indefinidos no plural.

Também foi incluído o conjunto de 30 frases de tradução sobre adjetivos.

## Observação

O arquivo da conversa anexado que foi recuperado diretamente nesta sessão não contém todo o histórico que você descreveu. Por isso, esta versão usa também os conteúdos que já foram trabalhados no contexto desta conversa, mas não inventa páginas para assuntos que não temos evidência suficiente de que tenham sido estudados.

## GitHub Pages

É um site estático. Não exige Node, framework ou build. Basta subir a pasta para um repositório e ativar GitHub Pages.

## Adicionando uma nova página em `paginas/`

Ao criar uma nova página de conteúdo em `paginas/`, não basta adicionar o arquivo HTML. É preciso atualizar também os pontos que alimentam a navegação, a listagem de conteúdos e o modo offline.

### Checklist

1. **Criar o arquivo HTML em `paginas/`**
   - Exemplo: `paginas/adverbios.html`.
   - Usar a estrutura visual já adotada pelas outras páginas.
   - Incluir `<div class="lesson-nav"></div>` próximo ao final do conteúdo para que a navegação anterior/próxima seja montada automaticamente.
   - Carregar `../js/app.js` no final da página.

2. **Adicionar a página em `js/conteudos.js`**
   - Incluir um novo objeto no array `conteudos`:

```js
{
  arquivo: "adverbios.html",
  titulo: "Advérbios",
  descricao: "tipos de advérbios, particularidades e posição na frase",
  categoria: "Advérbios",
  tag: "Gramática"
}
```

   Essa configuração é usada automaticamente por:
   - a listagem de conteúdos da página inicial;
   - o menu lateral;
   - a navegação anterior/próxima das páginas;
   - a busca global do site.

3. **Adicionar o arquivo em `sw.js`**
   - Inserir o caminho da nova página no array `ARQUIVOS`:

```js
"paginas/adverbios.html",
```

   Isso garante que a página também fique disponível offline.

4. **Atualizar o `CACHE_NAME` em `sw.js`**
   - Sempre que uma nova página ou outro arquivo estático for incluído ou alterado, incrementar a versão do cache.
   - Exemplo:

```js
const CACHE_NAME = "lernen-deutsch-static-20261016-3";
```

   Sem essa alteração, o service worker pode continuar entregando a versão anterior dos arquivos já armazenados no navegador, porque aparentemente cache também desenvolve apego emocional.

### O que não precisa ser alterado manualmente

Não é necessário adicionar links diretamente no `index.html`, no menu lateral ou na navegação entre lições. Esses elementos são gerados a partir de `js/conteudos.js` pelo `js/app.js`.

Também não é necessário cadastrar manualmente a página em `js/busca-site.js`: páginas presentes em `js/conteudos.js` entram automaticamente no índice da busca global.

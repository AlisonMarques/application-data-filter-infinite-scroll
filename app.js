//obtendo e armazenando as referências das div's
const postsContainer = document.querySelector("#posts-container");
const loaderContainer = document.querySelector(".loader");
const filterInput = document.querySelector("#filter");

let page = 1;

// função para buscar os posts da api json
const getPosts = async () => {
   const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`
   );

   return response.json();
};

// função que gera os templates das div
const generatePostTemplate = (posts) =>
   posts
      .map(
         ({ id, title, body }) => `
   <div class="post">
      <div class="number">${id}</div>
      <div class="post-info">
         <h2 class="post-title">${title}</h2>
         <p class="post-body">${body}</p>
      </div>
   </div>
`
      )
      .join("");

// função para adicionar os dados ao dom/pagina  div html
const addPostsIntoDOM = async () => {
   const posts = await getPosts();
   const postsTemplate = generatePostTemplate(posts);

   //inserindo as divs dentro da postsContainer
   postsContainer.innerHTML += postsTemplate;
};

addPostsIntoDOM();

// adicionando novos posts e aumentando a paginação
const getNextPosts = () => {
   setTimeout(() => {
      page++;
      addPostsIntoDOM();
   }, 300);
};

// removendo o loader após 1 segundo
const removeLoader = () => {
   setTimeout(() => {
      loaderContainer.classList.remove("show");
      getNextPosts();
   }, 1000);
};

// criando o loader da pagina
const showLoader = () => {
   loaderContainer.classList.add("show");

   removeLoader();
};

// função que calcula o limite final da tela e mostra o loader
const handleScrollToPageBottom = () => {
   const { clientHeight, scrollHeight, scrollTop } = document.documentElement;

   // checando se o usuário está perto do final da pagina
   const isPageBottomAlmostReached =
      scrollTop + clientHeight >= scrollHeight - 10;

   if (isPageBottomAlmostReached) {
      // chamando o loader quando estiver no final da page
      showLoader();
   }
};

// função que renderiza de acordo com o input
const showPostIfMatchInputValue = (inputValue) => (post) => {
   // obtendo o texto do elemento post-title
   const postTitle = post
      .querySelector(".post-title")
      .textContent.toLowerCase();

   const postBody = post.querySelector(".post-body").textContent.toLowerCase();

   //verificando se o title ou o corpo do elemento possui caracteres q foi passando no inputValue
   const postContainsInputValue =
      postTitle.includes(inputValue) || postBody.includes(inputValue);
   if (postContainsInputValue) {
      //Se uma dessas condições forem verdade vão ser exibida
      post.style.display = "flex";
      return;
   }

   post.style.display = "none";
};

// pegando valor do input de pesquisa
const handleInputValue = (event) => {
   // pegando o valor digitado
   const inputValue = event.target.value.toLowerCase();

   // obtendo referencia do que foi digitado com base nos posts
   const posts = document.querySelectorAll(".post");

   posts.forEach(showPostIfMatchInputValue(inputValue));
};

// captando o scroll e mostrando o loader no final da page
window.addEventListener("scroll", handleScrollToPageBottom);

// Criando o filter
filterInput.addEventListener("input", handleInputValue);

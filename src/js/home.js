// console.log('hola mundo!');
// const noCambia = "Leonidas";

// let cambia = "@LeonidasEsteban"

// function cambiarNombre(nuevoNombre) {
//   cambia = nuevoNombre
// }

// const getUserAll = new Promise(function(todoBien, todoMal) {
//   // llamar a un api
//   setTimeout(function() {
//     // luego de 3 segundos
//     todoBien('se acabó el tiempo');
//   }, 5000)
// });

// const getUser = new Promise(function(todoBien, todoMal) {
//   // llamar a un api
//   setTimeout(function() {
//     // luego de 3 segundos
//     todoBien('se acabó el tiempo 3');
//   }, 3000)
// });

// getUser
//   .then(function() {
//     console.log('todo está bien en la vida')
//   })
//   .catch(function(message) {
//     console.log(message)
//   })
// Promesas con race u all
// Promise.race([
//   getUser,
//   getUserAll,
// ])
// .then(function(message) {
//   console.log(message);
// })
// .catch(function(message) {
//   console.log(message)
// })


// XMLHttpRequest jquery example
// $.ajax('https://randomuser.me/api/', {
//   method: 'GET',
//   success: function(data) {
//     console.log(data)
//   },
//   error: function(error) {
//     console.log(error)
//   }
// })

// Resolviendo promesas
// fetch('https://randomuser.me/api/')
//   .then(function (response) {
//     // console.log(response)
//     return response.json()
//   })
//   .then(function (user) {
//     console.log('user', user.results[0].name.first)
//   })
//   .catch(function() {
//     console.log('algo falló')
//   });
  
  // Funciones asincronas
(async function load() {
    //await
    // action
    // horror
    // animation
  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json()
    if (data.data.movie_count > 0) {
      // aquí se acaba
      return data;
    }
    // si no hay pelis aquí continua
    throw new Error('No se encontró ningun resultado');
  }

  const $form = document.getElementById('form')
  const $home = document.getElementById('home')
  const $featuringContainer = document.getElementById('featuring');

  function setAttributes($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute]);
    }
  }

const BASE_API = 'https://yts.lt/api/v2/'

  function featuringTemplate(peli) {
    return (
  `
    <div class="featuring">
      <div class="featuring-image">
        <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
      </div>
      <div class="featuring-content">
        <p class="featuring-title">Pelicula encontrada</p>
        <p class="featuring-album">${peli.title}</p>
      </div>
    </div>
    `
    )
  }

  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $home.classList.add('search-active')
    const $loader = document.createElement('img')
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    })
    $featuringContainer.append($loader);

    const data = new FormData($form);
    try {
      const {
        data: {
          movies: pelis
        }
      } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)

      const HTMLString = featuringTemplate(pelis[0]);
      $featuringContainer.innerHTML = HTMLString;
    } catch(error) {
      alert(error.message);
      $loader.remove();
      $home.classList.remove('search-active');
    }

  })

  function videoItemTemplate(movie, category) {
    return (
      `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
        <div class="primaryPlaylistItem-image">
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`
    )
  }

  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString
    return html.body.children[0]
  }
  
  function addEventClick($element) {
    $element.addEventListener('click', () => {
      //alert('click')
      showModal($element)
    })
  }

  function renderMovieList(list, $container, category) {
    // actionList.data.movies
    $container.children[0].remove();
    list.forEach((movie)=> {
      const HTMLString = videoItemTemplate(movie, category)
      const movieElement = createTemplate(HTMLString)
      $container.append(movieElement)
      //animacion de la carga de las imagenes 
      const image = movieElement.querySelector('img');
      image.addEventListener('load', (event) => {
        event.srcElement.classList.add('fadeIn');
      })
      addEventClick(movieElement)
      //  console.log(HTMLString);
    })
  }

  async function cacheExist(category) {
    const listName = `${category}List`;
    const cacheList = window.localStorage.getItem(listName);

    if (cacheList) {
      return JSON.parse(cacheList);
    }
    const { data: { movies: data } } = await getData(`${BASE_API}list_movies.json?genre=${category}&sort_by=download_count`)
    window.localStorage.setItem(listName, JSON.stringify(data))

    return data;
  }

  const $actionContainer = document.querySelector('#action');
  const $dramaContainer = document.getElementById('drama');
  const $animationContainer = document.getElementById('animation');

  // Resetear los datos

  async function updateData(category, container) {
    const list = await cacheExist(category);
    renderMovieList(list, container, category);
    return list;
  }

  const $links = document.getElementsByClassName('link');
  
  /* let actionList = await updateData('action', $actionContainer);
  let dramaList = await updateData('drama', $dramaContainer);
  let animationList = await updateData('animation', $animationContainer);
 */
  let [actionList, dramaList, animationList] = await Promise.all([
    updateData('action', $actionContainer),
    updateData('drama', $dramaContainer),
    updateData('animation', $animationContainer)
  ]);

  [].forEach.call($links, element => {
    element.addEventListener('click', event => {
      const updateTerm = event.target.dataset.update;
      localStorage.removeItem(`${updateTerm}List`)
      location.reload()
    })
  })

  // Resetear los datos

  // const { data: { movies: actionList} } = await getData(`${BASE_API}list_movies.json?genre=action&sort_by=download_count`)
  //Local Storage
  // window.localStorage.setItem('actionList', JSON.stringify(actionList))
  // const actionList = await cacheExist('action');
  // const $actionContainer = document.querySelector('#action');
  // renderMovieList(actionList,$actionContainer, 'action')

  // // const { data: { movies: dramaList} } = await getData(`${BASE_API}list_movies.json?genre=drama&sort_by=download_count`)
  // const dramaList = await await cacheExist('drama');
  // const $dramaContainer = document.getElementById('drama');
  // renderMovieList(dramaList, $dramaContainer, 'drama');

  // // const { data: { movies: animationList} } = await getData(`${BASE_API}list_movies.json?genre=animation&sort_by=download_count`)
  // const animationList = await await cacheExist('animation');
  // const $animationContainer = document.getElementById('animation');
  // renderMovieList(animationList, $animationContainer, 'animation');
  
  
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');
  
  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');

  //Encontrando elementos en la lista
  function findById(list, id) {
    return list.find(movie => movie.id === parseInt(id, 10))
  }

  //Encontrando elementos en la lista
  function findMovie(id, category) {
    switch (category) {
      case 'action' : {
        return findById(actionList, id)
      }
      case 'drama' : {
        return findById(dramaList, id)
      }
      default: {
        return findById(animationList, id)
      }
    }
  }

  function showModal($element) {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const data = findMovie(id, category);

    //Encontrando elementos en la lista
    $modalTitle.textContent = data.title;
    $modalImage.setAttribute('src', data.medium_cover_image);
    $modalDescription.textContent = data.description_full

  }

  $hideModal.addEventListener('click', hideModal);
  
  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .8s forwards';
  }

  async function getUser (url) {
    const response = await fetch(url)
    const data = await response.json()
    return data
  }

  function templateUser(name, picture) {
    return (
      `<li class='playlistFriends-item'>
      <a href="#">
        <img src="${picture}" alt="echame la culpa" />
        <span>
          ${name.first} ${name.last}
        </span>
      </a>
      </li>`
    )
  }

  function addUserToList(list) {
    list.forEach((user) => {
      const HTMLString = templateUser(user.name, user.picture.thumbnail)
      const userElement = createTemplate(HTMLString)
      $userList.append(userElement)
    })
  }

  const $userList = document.getElementById('userList')
  const userList = await getUser('https://randomuser.me/api/?results=10')
  addUserToList(userList.results)

})()


//   async function cacheExist(category) {
//     const listName = `${category}List`;
//     const cacheList = window.localStorage.getItem(listName);

//     if (cacheList) {
//       return JSON.parse(cacheList);
//     }
//     window.localStorage.setItem(listName, JSON.stringify(data))

//     return data;
//   }

//   const actionList = await cacheExist('action');
//   // window.localStorage.setItem('actionList', JSON.stringify(actionList))

//   const dramaList = await await cacheExist('drama');

//   const animationList = await await cacheExist('animation');

//   // const $home = $('.home .list #item');

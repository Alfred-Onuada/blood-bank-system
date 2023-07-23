window.onload = function (e) {
  // update min date
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  } 
      
  today = yyyy + '-' + mm + '-' + dd;
  document.getElementById("donateDate")?.setAttribute("min", today);
  document.getElementById("requestDate")?.setAttribute("min", today);

}

function showMsg(msg, elemId) {
  document.getElementById(elemId).classList.remove('hide');
  document.getElementById(elemId).classList.add('shake');
  document.getElementById(elemId).textContent = msg;


  setTimeout(() => {
    document.getElementById(elemId).classList.remove('shake');
    document.getElementById(elemId).classList.add('hide');
    document.getElementById(elemId).textContent = "";
  }, 4000)
}

function editProfile() {
  document.getElementById('beforeEditBtns').classList.add('hide');
  document.getElementById('afterEditBtns').classList.remove('hide');

  [].forEach.call(document.getElementsByClassName('editable'), (item) => {
    item.removeAttribute('disabled')
  })
}

function cancelEdit() {
  document.getElementById('afterEditBtns').classList.add('hide');
  document.getElementById('beforeEditBtns').classList.remove('hide');

  [].forEach.call(document.getElementsByClassName('editable'), (item) => {
    item.setAttribute('disabled', true)
  })
}

function saveProfileChanges(type) {
  // Tiny magic
  const hospitalFields = ['hospitalName', 'email', 'address', 'state', 'password'];
  const donorFields = ['fullName', 'email', 'phone', 'age', 'bloodGroup', 'genotype', 'password'];

  let payload = {};

  if (type == 'hospital') {
    payload = Object.fromEntries(hospitalFields.map((field, idx) => ([hospitalFields[idx], document.getElementById(field).value])))
  } else if (type == 'donor') {
    payload = Object.fromEntries(donorFields.map((field, idx) => ([donorFields[idx], document.getElementById(field).value])))
  } else {
    alert('Invalid action');
    return false;
  }

  fetch(`/user/editProfile/${type}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showMsg(error, 'editFailed');
        return;
      }

      showMsg(data.message, 'editSuccess');
    })

  return false;
}

function register(type) {
  // Tiny magic
  const hospitalIds = ['hospitalNameReg', 'hospitalEmailReg', 'hospitalAddressReg', 'hospitalStateReg', 'hospitalPasswordReg'];
  const hospitalFields = ['hospitalName', 'email', 'address', 'state', 'password'];
  const donorIds = ['donorNameReg', 'donorEmailReg', 'donorPhoneReg', 'donorAgeReg', 'donorBloodGroupReg', 'donorGenotypeReg', 'donorPasswordReg'];
  const donorFields = ['fullName', 'email', 'phone', 'age', 'bloodGroup', 'genotype', 'password'];

  let payload = {};

  if (type == 'hospital') {
    payload = Object.fromEntries(hospitalIds.map((field, idx) => ([hospitalFields[idx], document.getElementById(field).value])))
  } else if (type == 'donor') {
    payload = Object.fromEntries(donorIds.map((field, idx) => ([donorFields[idx], document.getElementById(field).value])))
  } else {
    alert('Invalid action');
    return false;
  }

  fetch(`/auth/register/${type}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showMsg(error, `reg${type}`);
        return;
      }

      location.reload();
    })

  return false;
}

function login(type) {
  // Tiny magic
  const hospitalIds = ['hospitalEmailLogin', 'hospitalPasswordLogin'];
  const donorIds = ['donorEmailLogin', 'donorPasswordLogin'];
  const fields = ['email', 'password'];
  
  let payload = {};

  if (type == 'hospital') {
    payload = Object.fromEntries(hospitalIds.map((field, idx) => ([fields[idx], document.getElementById(field).value])))
  } else if (type == 'donor') {
    payload = Object.fromEntries(donorIds.map((field, idx) => ([fields[idx], document.getElementById(field).value])))
  } else {
    alert('Invalid action');
    return false;
  }

  fetch(`/auth/login/${type}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showMsg(error, `login${type}`);
        return;
      }

      location.reload();
    })

  return false;
}

function requestBlood() {
  const requestIds = ['requestBloodGroup', 'requestGenotype', 'requestQuantity', 'requestDate'];
  const fields = ['bloodGroup', 'genotype', 'quantity', 'date'];

  let payload = {};

  payload = Object.fromEntries(requestIds.map((field, idx) => ([fields[idx], document.getElementById(field).value])))

  fetch(`/user/request`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showMsg(error, 'requestFailed');
        return;
      }

      showMsg(data.message, 'requestSuccess');
    })

  return false;
}

function getCenters() {
  const state = document.getElementById('donateState').value;

  fetch(`/user/centers/${state}`)
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showMsg(error, 'donateFailed');
        return;
      }

      document.getElementById('donateCenter').innerHTML = '';
      
      // populate the select elem
      for (const { hospitalName } of data.data) {
        const node = document.createElement('option');
        node.textContent = hospitalName;
        document.getElementById('donateCenter').appendChild(node)
      }

      document.getElementById('donateCenter').removeAttribute('disabled');
      document.getElementById('donateBtn').removeAttribute('disabled');
    })
}

function giveBlood() {
  const requestIds = ['donateQuantity', 'donateDate', 'donateState', 'donateCenter'];
  const fields = ['quantity', 'date', 'state', 'center'];

  let payload = {};

  payload = Object.fromEntries(requestIds.map((field, idx) => ([fields[idx], document.getElementById(field).value])))

  fetch(`/user/donate`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showMsg(error, 'donateFailed');
        return;
      }

      showMsg(data.message, 'donateSuccess');
    })

  return false;
}








(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  let selectTopbar = select('#topbar')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.add('topbar-scrolled')
        }
      } else {
        selectHeader.classList.remove('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.remove('topbar-scrolled')
        }
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Initiate glightbox 
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Gallery Lightbox 
   */
  const galelryLightbox = GLightbox({
    selector: '.galelry-lightbox'
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 2,
        spaceBetween: 20
      }
    }
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()


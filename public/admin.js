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

function adminLogin() {
  const payload = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  }
  
  fetch('/admin/login', {
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
        showMsg(error, 'login');
        return;
      }

      location.assign('/admin/requests');
    })

  return false
}

function updateReasonModal(id, type) {
  document.getElementById('requestId').value = id;
  document.getElementById('requestType').value = type;
}

function rejectFunc() {
  const id = document.getElementById('requestId').value;
  const type = document.getElementById('requestType').value;
  const reason = document.getElementById('reason').value;

  if (type == 'request') {
    rejectRequest(id, reason);
  } else {
    rejectDonation(id, reason);
  }
}

function rejectRequest(requestId, reason) {
  fetch(`/admin/rejectRequest/${requestId}`, {
    method: 'PATCH',
    body: JSON.stringify({ msg: reason }),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showMsg(error, 'rejectFailed');
        return;
      }

      location.reload();
    })
}

function approveRequest(requestId) {
  fetch(`/admin/approveRequest/${requestId}`, {
    method: 'PATCH'
  })
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showMsg(error, 'requestBlood');
        return;
      }

      location.reload();
    })
}

function rejectDonation(donationId, reason) {
  fetch(`/admin/rejectDonation/${donationId}`, {
    method: 'PATCH',
    body: JSON.stringify({ msg: reason }),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showMsg(error, 'rejectfailed');
        return;
      }

      location.reload();
    })
}

function approveDonation(donationId) {
  fetch(`/admin/approveDonation/${donationId}`, {
    method: 'PATCH'
  })
    .then(async (resp) => {
      const data = await resp.json();

      if (resp.status != 200) {
        const error = data?.errors ? data.errors[0] : data.message;
        showMsg(error, 'bloodDonation');
        return;
      }

      location.reload();
    })
}


function switchPanel(panel) {
  [].forEach.call(document.getElementsByClassName('panel'), (elem) => elem.classList.add('hide'));  

  document.getElementById(panel).classList.remove('hide');
}
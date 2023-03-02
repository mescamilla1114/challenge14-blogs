const newFormHandler = async (event) => {
    event.preventDefault();
  
    const name = document.querySelector('#comment-name').value.trim();
    
    const description = document.querySelector('#comment-desc').value.trim();
    const id=document.querySelector('.new-comment-form').dataset.id;
    console.log(id);

    if (name && description) {
      const response = await fetch(`/blog/${id}`, {
        method: 'POST',
        body: JSON.stringify({ name, description }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  console.log(response);
      if (response.ok) {
        console.log("comment worked")
        //document.location.replace(`/blog/${id}`);
      } else {
        alert('Failed to create comment');
      }
    }
  };
    
  document
    .querySelector('.new-comment-form')
    .addEventListener('submit', newFormHandler);
  
  /*document
    .querySelector('.comment-list')
    .addEventListener('click', newFormHandler);*/
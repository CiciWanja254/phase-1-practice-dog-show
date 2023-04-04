document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#table-body");
    const dogForm = document.querySelector("#dog-form");
  
    // Fetch all dogs and render them in the table
    fetch("http://localhost:3000/dogs")
      .then((response) => response.json())
      .then((dogs) => {
        tableBody.innerHTML = "";
        dogs.forEach((dog) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${dog.name}</td>
              <td>${dog.breed}</td>
              <td>${dog.sex}</td>
              <td><button data-id="${dog.id}">Edit</button></td>
            `;
          tableBody.appendChild(row);
        });
      });
  
    // Handle clicking the Edit button
    tableBody.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") {
        const dogId = event.target.dataset.id;
        fetch(`http://localhost:3000/dogs/${dogId}`)
          .then((response) => response.json())
          .then((dog) => {
            dogForm.elements["name"].value = dog.name;
            dogForm.elements["breed"].value = dog.breed;
            dogForm.elements["sex"].value = dog.sex;
            dogForm.dataset.id = dog.id;
          });
      }
    });
  
    // Handle submitting the form
    dogForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const dogId = dogForm.dataset.id;
      const formData = {
        name: dogForm.elements["name"].value,
        breed: dogForm.elements["breed"].value,
        sex: dogForm.elements["sex"].value,
      };
      fetch(`http://localhost:3000/dogs/${dogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then(() => {
          // Refetch all dogs and re-render the table
          fetch("http://localhost:3000/dogs")
            .then((response) => response.json())
            .then((dogs) => {
              tableBody.innerHTML = "";
              dogs.forEach((dog) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${dog.name}</td>
                    <td>${dog.breed}</td>
                    <td>${dog.sex}</td>
                    <td><button data-id="${dog.id}">Edit</button></td>
                  `;
                tableBody.appendChild(row);
              });
            });
  
          // Clear the form
          dogForm.elements["name"].value = "";
          dogForm.elements["breed"].value = "";
          dogForm.elements["sex"].value = "";
          delete dogForm.dataset.id;
        });
    });
  });
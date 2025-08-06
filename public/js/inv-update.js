const form = document.querySelector("#updateInventoryForm");

form.addEventListener("change", function () {
  const updateBtn = document.querySelector(".btnupdate");
  updateBtn.removeAttribute("disabled");
});

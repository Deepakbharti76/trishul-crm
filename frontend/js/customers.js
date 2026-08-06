/* =========================================================================
   TRISHUL CRM — Customers module (CRUD via /customers)
   ========================================================================= */

let allCustomers = [];

document.addEventListener("trishul:ready", () => {
  loadCustomers();
  wireToolbar();
  wireModal();
});

async function loadCustomers() {
  const body = document.getElementById("tableBody");
  body.innerHTML = `<tr><td colspan="7"><div class="loader-row"><span class="spinner"></span> Loading customers…</div></td></tr>`;
  try {
    const res = await Api.get("/customers");
    allCustomers = res.data || [];
    renderTable();
  } catch (err) {
    body.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-plug-circle-xmark"></i><p>${Fmt.escape(err.message)}</p></div></td></tr>`;
  }
}

function renderTable() {
  const body = document.getElementById("tableBody");
  const search = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const status = document.getElementById("statusFilter").value;

  let rows = allCustomers.filter((c) => {
    const matchesSearch =
      !search ||
      [c.name, c.email, c.company].some((v) =>
        (v || "").toLowerCase().includes(search),
      );
    const matchesStatus = !status || c.status === status;
    return matchesSearch && matchesStatus;
  });

  if (rows.length === 0) {
    body.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-address-book"></i><p>No customers found. Try adjusting your search or add a new one.</p></div></td></tr>`;
    return;
  }

  const canDelete = ["ADMIN", "SUPERVISOR"].includes(
    (Session.get() || {}).role,
  );

  body.innerHTML = rows
    .map(
      (c) => `
        <tr>
            <td><strong>${Fmt.escape(c.name)}</strong></td>
            <td>${Fmt.escape(c.email || "—")}<div class="cell-sub">${Fmt.escape(c.phone || "")}</div></td>
            <td>${Fmt.escape(c.company || "—")}</td>
            <td>${Fmt.escape(c.address || "—")}</td>
            <td><span class="badge ${c.status === "ACTIVE" ? "success" : "neutral"}">${c.status}</span></td>
            <td>${Fmt.date(c.createdAt)}</td>
            <td>
                <div class="row-actions">
                    <button onclick="editCustomer(${c.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    ${canDelete ? `<button class="del" onclick="deleteCustomer(${c.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>` : ""}
                </div>
            </td>
        </tr>
    `,
    )
    .join("");
}

function wireToolbar() {
  document.getElementById("searchInput").addEventListener("input", renderTable);
  document
    .getElementById("statusFilter")
    .addEventListener("change", renderTable);
}

function wireModal() {
  const modal = document.getElementById("formModal");
  const form = document.getElementById("customerForm");
  wirePhoneInput(document.getElementById("phone"));
  wireNameInput(document.getElementById("name"));

  document
    .getElementById("openCreateModal")
    .addEventListener("click", () => openModal());
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("cancelForm").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("name");
    if (!nameInput.value.trim()) {
      nameInput.nextElementSibling?.style &&
        (nameInput.nextElementSibling.style.display = "block");
      return;
    }

    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      company: document.getElementById("company").value.trim(),
      address: document.getElementById("address").value.trim(),
      status: document.getElementById("status").value,
    };

    const id = document.getElementById("customerId").value;
    const btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Saving…';

    try {
      if (id) {
        await Api.put(`/customers/${id}`, payload);
        Toast.success("Customer updated successfully");
      } else {
        await Api.post("/customers", payload);
        Toast.success("Customer added successfully");
      }
      closeModal();
      loadCustomers();
    } catch (err) {
      Toast.error(err.message || "Failed to save customer");
    } finally {
      btn.disabled = false;
      btn.innerHTML = "Save Customer";
    }
  });
}

function openModal(customer = null) {
  const modal = document.getElementById("formModal");
  document.getElementById("customerForm").reset();
  document.querySelector("#customerForm .field-error").style.display = "none";

  if (customer) {
    document.getElementById("modalTitle").textContent = "Edit Customer";
    document.getElementById("customerId").value = customer.id;
    document.getElementById("name").value = customer.name || "";
    document.getElementById("email").value = customer.email || "";
    document.getElementById("phone").value = customer.phone || "";
    document.getElementById("company").value = customer.company || "";
    document.getElementById("address").value = customer.address || "";
    document.getElementById("status").value = customer.status || "ACTIVE";
  } else {
    document.getElementById("modalTitle").textContent = "Add Customer";
    document.getElementById("customerId").value = "";
  }
  modal.classList.add("open");
}

function closeModal() {
  document.getElementById("formModal").classList.remove("open");
}

function editCustomer(id) {
  const customer = allCustomers.find((c) => c.id === id);
  if (customer) openModal(customer);
}

async function deleteCustomer(id) {
  if (!["ADMIN", "SUPERVISOR"].includes((Session.get() || {}).role)) {
    Toast.error("You do not have permission to delete customers.");
    return;
  }
  if (!confirm("Delete this customer? This action cannot be undone.")) return;
  try {
    await Api.del(`/customers/${id}`);
    Toast.success("Customer deleted");
    loadCustomers();
  } catch (err) {
    Toast.error(err.message || "Failed to delete customer");
  }
}

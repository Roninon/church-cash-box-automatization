document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");
    const orderList = document.querySelector(".order-list");
    const totalPriceElement = document.querySelector(".total-price");
    const resetButton = document.querySelector(".reset-order");
    const saveButton = document.querySelector(".save-order");
    const totalResetButton = document.querySelector(".total-reset");
    const accumulatedTotalElement = document.querySelector(".accumulated-total");

    let order = [];
    let accumulatedTotal = 0; // Общая накопленная сумма

    // Загружаем накопленную сумму из локального хранилища
    if (localStorage.getItem("accumulatedTotal")) {
        accumulatedTotal = parseInt(localStorage.getItem("accumulatedTotal"), 10);
        accumulatedTotalElement.textContent = `${accumulatedTotal} грн`;
    }

    // Добавляем переменные для хранения количества товаров
    const quantities = {};

    menuItems.forEach(item => {
        const plusButton = item.querySelector(".plus");
        const minusButton = item.querySelector(".minus");
        const quantityElement = item.querySelector(".quantity");
        const itemName = item.querySelector("span").textContent;
        const itemPrice = parseInt(item.dataset.price);

        // Инициализируем количество товара для каждого элемента
        quantities[itemName] = 0;

        plusButton.addEventListener("click", () => {
            quantities[itemName]++;
            quantityElement.textContent = quantities[itemName];
            updateOrder(itemName, itemPrice, quantities[itemName]);
        });

        minusButton.addEventListener("click", () => {
            if (quantities[itemName] > 0) {
                quantities[itemName]--;
                quantityElement.textContent = quantities[itemName];
                updateOrder(itemName, itemPrice, quantities[itemName]);
            }
        });
    });

    function updateOrder(name, price, quantity) {
        const existingItem = order.find(item => item.name === name);
        if (existingItem) {
            if (quantity === 0) {
                order = order.filter(item => item.name !== name);
            } else {
                existingItem.quantity = quantity;
                existingItem.total = quantity * price;
            }
        } else if (quantity > 0) {
            order.push({ name, quantity, total: quantity * price });
        }
        renderOrder();
    }

    function renderOrder() {
        orderList.innerHTML = "";
        let totalPrice = 0;

        order.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.name} x${item.quantity} - ${item.total} грн`;
            orderList.appendChild(listItem);
            totalPrice += item.total;
        });

        totalPriceElement.textContent = `${totalPrice} грн`;
    }

    // Функция сброса заказа (используется в обеих кнопках)
    function resetOrder() {
        // Сбрасываем данные заказа
        order = [];

        // Сбрасываем количество для каждого товара
        menuItems.forEach(item => {
            const quantityElement = item.querySelector(".quantity");
            const itemName = item.querySelector("span").textContent;

            quantities[itemName] = 0; // Сбрасываем внутренний счётчик
            quantityElement.textContent = "0"; // Обнуляем отображаемое количество
        });

        // Сбрасываем итоговую стоимость
        renderOrder();
        totalPriceElement.textContent = "0 грн";
    }

    // Обработчик для кнопки сброса
    resetButton.addEventListener("click", () => {
        resetOrder(); // Вызов общей функции сброса
    });

    // Обработчик для кнопки сохранения
    saveButton.addEventListener("click", () => {
        const currentTotal = parseInt(totalPriceElement.textContent.replace(" грн", ""));
        if (currentTotal > 0) {
            accumulatedTotal += currentTotal; // Добавляем сумму текущего заказа к накопленной
            localStorage.setItem("accumulatedTotal", accumulatedTotal); // Сохраняем накопленную сумму в локальное хранилище
            accumulatedTotalElement.textContent = `${accumulatedTotal} грн`; // Обновляем отображение накопленной суммы
            resetOrder(); // Сбрасываем текущий заказ после сохранения
        } else {
            alert("Вы не добавили ничего в заказ!"); // Предупреждение, если заказ пуст
        }
    });

    // Обработчик для кнопки тотального сброса
    totalResetButton.addEventListener("click", () => {
        if (confirm("Вы уверены, что хотите сбросить все данные?")) {
            accumulatedTotal = 0; // Обнуляем накопленную сумму
            localStorage.removeItem("accumulatedTotal"); // Удаляем данные из локального хранилища
            accumulatedTotalElement.textContent = "0 грн"; // Обновляем отображение накопленной суммы
            resetOrder(); // Сбрасываем текущий заказ
        }
    });
});

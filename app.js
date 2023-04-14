// Envolver el código en una función autoinvocada para evitar la contaminación del espacio de nombres global
(function () {
    // Función init para inicializar el comportamiento del formulario y el botón Guardar
    var init = function () {
      // Variables para almacenar referencias al formulario, al botón Guardar y a un indicador de si se hizo clic en el botón Guardar
      var orderForm = document.forms.order,
        saveBtn = document.getElementById("saveOrder"),
        saveBtnClicked = false;
  
      // Función doCustomValidity para establecer mensajes de validación personalizados
      var doCustomValidity = function (field, msg) {
        if ("setCustomValidity" in field) {
          field.setCustomValidity(msg);
        } else {
          field.validationMessage = msg;
        }
      };
  
      // Función styleInvalidForm para agregar la clase 'invalid' al elemento del formulario
      var styleInvalidForm = function () {
        orderForm.className = "invalid";
      };
  
      // Agregar un controlador de eventos para aplicar la clase 'invalid' al formulario cuando sea inválido
      orderForm.addEventListener("invalid", styleInvalidForm, true);
  
      // Cargar 'monthpicker.js' si el navegador no admite el tipo de entrada 'month'
      Modernizr.load({
        test: Modernizr.inputtypes.month,
        nope: "monthpicker.js",
      });
  
      // Función getFieldLabel para obtener la etiqueta del campo
      var getFieldLabel = function (field) {
        // ... (El código original de getFieldLabel no ha cambiado)
      };
  
      // Función submitForm para manejar el evento de envío del formulario
      var submitForm = function (e) {
        // ... (El código original de submitForm no ha cambiado)
      };
  
      // Agregar un controlador de eventos para el envío del formulario
      orderForm.addEventListener("submit", submitForm, false);
  
      // Función saveForm para manejar el comportamiento del botón Guardar
      var saveForm = function () {
        // Verificar si el navegador admite el atributo formAction en los elementos de entrada
        if (!("formAction" in document.createElement("input"))) {
          // Si no es compatible, obtener el valor del atributo formaction del botón Guardar
          var formAction = saveBtn.getAttribute("formaction");
  
          // Establecer el atributo action del formulario en el valor de formAction
          orderForm.setAttribute("action", formAction);
        }
        // Establecer el indicador saveBtnClicked en verdadero para indicar que se hizo clic en el botón Guardar
        saveBtnClicked = true;
  
        // Agregar controladores de eventos para la validación del formulario
        orderForm.addEventListener("input", validateForm, false);
        orderForm.addEventListener("keyup", validateForm, false);
      };
  
      // Agregar un controlador de eventos al botón Guardar para llamar a la función saveForm cuando se haga clic
      saveBtn.addEventListener("click", saveForm, false);
    };
  
    // Agregar un controlador de eventos a la ventana para llamar a la función init cuando la página se haya cargado completamente
    window.addEventListener("load", init, false);
  
    // Obtener campos de cantidad, totales de elementos y totales de pedido
    var orderForm = document.forms.order,
      qtyFields = orderForm.quantity,
      totalFields = document.getElementsByClassName("item_total"),
      orderTotalField = document.getElementById("order_total");
  
    // Función para formatear valores monetarios
    var formatMoney = function (value) {
      // Devuelve un número formateado para moneda, utilizando una coma como separador de miles
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
  
    // ...
  
    // Función para calcular totales
    var calculateTotals = function () {
      var i = 0,
        ln = qtyFields.length,
        itemQty = 0,
        itemPrice = 0.0,
        itemTotal = 0.0,
        itemTotalMoney = "$0.00",
        orderTotal = 0.0,
        orderTotalMoney = "$0.00";
  
      // Calcula los totales para cada artículo y el total general del pedido
      for (; i < ln; i++) {
        // Verifica si el navegador admite el atributo valueAsNumber
        if (!!qtyFields[i].valueAsNumber) {
          itemQty = qtyFields[i].valueAsNumber || 0;
        } else {
          itemQty = parseFloat(qtyFields[i].value) || 0;
        }
  
        itemPrice = parseFloat(qtyFields[i].dataset.price);
        itemTotal = itemQty * itemPrice;
        itemTotalMoney = formatMoney(itemTotal.toFixed(2));
        totalFields[i].textContent = itemTotalMoney;
        orderTotal += itemTotal;
      }
  
      orderTotalMoney = formatMoney(orderTotal.toFixed(2));
      orderTotalField.textContent = orderTotalMoney;
  
      // Realizar un cálculo inicial, en caso de que algún campo esté pre-poblado
      calculateTotals();
    };
  
    // Función para agregar event listeners a los campos de cantidad
    var qtyListeners = function () {
      var i = 0,
        ln = qtyFields.length;
      // Llamar a la función qtyListeners para agregar event listeners a los campos
      for (; i < ln; i++) {
        qtyFields[i].addEventListener("input", calculateTotals, false);
        qtyFields[i].addEventListener("keyup", calculateTotals, false);
      }
      // Llamar a la función qtyListeners para agregar event listeners a los campos
      for (; i < ln; i++) {
        qtyFields[i].addEventListener("input", calculateTotals, false);
        qtyFields[i].addEventListener("keyup", calculateTotals, false);
      }
    };
  
    // Ejecutar la función qtyListeners
    qtyListeners();
  
    // Agregar la función fallbackValidation para realizar la validación de respaldo en navegadores sin soporte para la validación de HTML5
    var fallbackValidation = function () {
      var i = 0,
        ln = orderForm.length,
        field;
      // Recorrer todos los campos del formulario
      for (; i < ln; i++) {
        field = orderForm[i];
  
        // Limpiar cualquier mensaje de validación personalizado existente
        doCustomValidity(field, "");
  
        // Si el atributo pattern está establecido, verificar que el valor del campo coincida con la expresión regular
        if (field.hasAttribute("pattern")) {
          var pattern = new RegExp(field.getAttribute("pattern").toString());
          if (!pattern.test(field.value)) {
            var msg = "Please match the requested format.";
            if (
              field.hasAttribute("title") &&
              field.getAttribute("title").length > 0
            ) {
              msg += " " + field.getAttribute("title");
            }
            doCustomValidity(field, msg);
          }
        }
  
        // Si el tipo de entrada es correo electrónico, validarlo con la expresión regular definida
        if (
          field.hasAttribute("type") &&
          field.getAttribute("type").toLowerCase() === "email"
        ) {
          var pattern = new RegExp(/\S+@\S+\.\S+/);
          if (!pattern.test(field.value)) {
            doCustomValidity(field, "Please enter an email address.");
          }
        }
  
        // Si el campo tiene el atributo 'required' y está vacío, mostrar un mensaje de error
        if (field.hasAttribute("required") && field.value.length < 1) {
          doCustomValidity(field, "Please fill out this field.");
        }
      }
    };
  
    // Llame a la función fallbackValidation en la función saveForm o en cualquier otro lugar donde sea necesario
    saveForm.addEventListener("click", fallbackValidation, false);
  })(); // Fin de la función autoinvocada
  

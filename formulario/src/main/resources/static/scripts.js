document.getElementById('solicitudForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (validarCampos()) {
        const formData = obtenerDatosFormulario();
        generarPDF(formData);
        enviarEmail(formData);
    }
});

document.getElementById('guardar').addEventListener('click', function(event) {
    event.preventDefault();
    if (validarCampos()) {
        const formData = obtenerDatosFormulario();
        generarPDF(formData, true);
    }
});

function validarCampos() {
    const nombreSolicitante = document.getElementById('nombreSolicitante').value;
    const email= document.getElementById('email').value;
    const fechaIngreso = document.getElementById('fechaIngreso').value;
    const horaIngreso = document.getElementById('horaIngreso').value;
    const horaCierre = document.getElementById('horaCierre').value;
    const lugarUtilizar = document.getElementById('lugarUtilizar').value;
    const nombreResponsable = document.getElementById('nombreResponsable').value;
    const numeroTelefono = document.getElementById('numeroTelefono').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombreSolicitante || !email || !fechaIngreso || !horaIngreso || !horaCierre || !lugarUtilizar || !nombreResponsable || !numeroTelefono) {
        alert('Todos los campos son obligatorios.');
        return false;
    }

    if (!/^\d{9,11}$/.test(numeroTelefono)) {
        alert('El número de teléfono debe tener entre 9 y 11 dígitos.');
        return false;
    }

    if(!email.endsWith('@gmail.com') || !emailPattern.test(email)){
        alert('El correo electrónico debe ser un Gmail.');
        return false;
    }

    return true;
}

function obtenerDatosFormulario() {
    const nombreSolicitante = document.getElementById('nombreSolicitante').value;
    const email= document.getElementById('email').value;
    const fechaIngreso = document.getElementById('fechaIngreso').value;
    const horaIngreso = document.getElementById('horaIngreso').value;
    const horaCierre = document.getElementById('horaCierre').value;
    const lugarUtilizar = document.getElementById('lugarUtilizar').value;
    const nombreResponsable = document.getElementById('nombreResponsable').value;
    const numeroTelefono = document.getElementById('numeroTelefono').value;
    const fechaForm = formatDate(fechaIngreso);

    return {
        nombreSolicitante,
        email,
        fechaForm,
        horaIngreso,
        horaCierre,
        lugarUtilizar,
        nombreResponsable,
        numeroTelefono
    };
}

function generarPDF(datos, descargar = false) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Formulario de ingreso a la universidad', 20, 20);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.text(`Solicitante: ${datos.nombreSolicitante}`, 20, 40);
    doc.text(`Email: ${datos.email}`, 20, 50);
    doc.text(`Fecha: ${datos.fechaForm}`, 20, 60);
    doc.text(`Hora de inicio: ${datos.horaIngreso}`, 20, 70);
    doc.text(`Hora de cierre: ${datos.horaCierre}`, 20, 80);
    doc.text(`Espacio a utilizar: ${datos.lugarUtilizar}`, 20, 90);
    doc.text(`Responsable: ${datos.nombreResponsable}`, 20, 100);
    doc.text(`Teléfono: ${datos.numeroTelefono}`, 20, 110);

    if (descargar) {
        doc.save(`formulario_${datos.nombreSolicitante}_${datos.fechaForm}.pdf`);
    } else {
        const pdfData = doc.output('blob');
        return pdfData;
    }
}

function enviarEmail(datos) {
    const pdfData = generarPDF(datos);

    const formData = new FormData();
    formData.append('solicitante', datos.nombreSolicitante);
    formData.append('email', datos.email);
    formData.append('fecha', datos.fechaForm);
    formData.append('hora_inicio', datos.horaIngreso);
    formData.append('hora_cierre', datos.horaCierre);
    formData.append('espacio', datos.lugarUtilizar);
    formData.append('pdf', pdfData, 'document.pdf');

    fetch('/api/send-email', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            alert('Email enviado con éxito');
        } else {
            alert('Error al enviar el email');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Error al enviar el email');
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

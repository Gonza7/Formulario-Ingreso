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
    const fechaHoraIngreso = document.getElementById('fechaHoraIngreso').value;
    const duracionActividad = document.getElementById('duracionActividad').value;
    const lugarUtilizar = document.getElementById('lugarUtilizar').value;
    const nombreResponsable = document.getElementById('nombreResponsable').value;
    const numeroTelefono = document.getElementById('numeroTelefono').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombreSolicitante || !email || !fechaHoraIngreso || !duracionActividad || !lugarUtilizar || !nombreResponsable || !numeroTelefono) {
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
    const fechaHoraIngreso = document.getElementById('fechaHoraIngreso').value;
    const duracionActividad = document.getElementById('duracionActividad').value;
    const lugarUtilizar = document.getElementById('lugarUtilizar').value;
    const nombreResponsable = document.getElementById('nombreResponsable').value;
    const numeroTelefono = document.getElementById('numeroTelefono').value;
    const fechaHoraForm = formatDate(fechaHoraIngreso);

    return {
        nombreSolicitante,
        email,
        fechaHoraForm,
        duracionActividad,
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
    doc.text(`Fecha y hora: ${datos.fechaHoraForm}`, 20, 60);
    doc.text(`Duración: ${datos.duracionActividad}`, 20, 70);
    doc.text(`Espacio a utilizar: ${datos.lugarUtilizar}`, 20, 80);
    doc.text(`Responsable: ${datos.nombreResponsable}`, 20, 90);
    doc.text(`Teléfono: ${datos.numeroTelefono}`, 20, 100);

    if (descargar) {
        doc.save(`formulario_${datos.nombreSolicitante}_${datos.fechaHoraForm}.pdf`);
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
    formData.append('fechahora', datos.fechaHoraForm);
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
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

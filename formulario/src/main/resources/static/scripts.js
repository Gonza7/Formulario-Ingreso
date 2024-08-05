document.getElementById('solicitudForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Validación de campos

    const nombreSolicitante = document.getElementById('nombreSolicitante').value;
    const fechaHoraIngreso = document.getElementById('fechaHoraIngreso').value;
    const duracionActividad = document.getElementById('duracionActividad').value;
    const lugarUtilizar = document.getElementById('lugarUtilizar').value;
    const nombreResponsable = document.getElementById('nombreResponsable').value;
    const numeroTelefono = document.getElementById('numeroTelefono').value;
    const fechaHoraForm = formatDate(fechaHoraIngreso);

    if (!nombreSolicitante || !fechaHoraIngreso || !duracionActividad || !lugarUtilizar || !nombreResponsable || !numeroTelefono) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    if (!/^\d{9,11}$/.test(numeroTelefono)) {
        alert('El número de teléfono debe tener entre 9 y 11 dígitos.');
        return;
    }

    // Si la validación es exitosa, se puede enviar el formulario
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Establecer el formato del PDF
    doc.setFontSize(18);
    doc.text('Formulario de ingreso a la universidad', 20, 20);

    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.text(`Solicitante: ${nombreSolicitante}`, 20, 40);
    doc.text(`Fecha y hora: ${fechaHoraForm}`, 20, 50);
    doc.text(`Duración: ${duracionActividad}`, 20, 60);
    doc.text(`Espacio a utilizar: ${lugarUtilizar}`, 20, 70);
    doc.text(`Responsable: ${nombreResponsable}`, 20, 80);
    doc.text(`Teléfono: ${numeroTelefono}`, 20, 90);

    // Descargar el PDF
    doc.save(`formulario_${nombreSolicitante}_${fechaHoraForm}.pdf`);
    const pdfData = doc.output('blob');

    const formData = new FormData();
    formData.append('solicitante',nombreSolicitante);
    formData.append('fechahora',fechaHoraForm);
    formData.append('espacio',lugarUtilizar);
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
    
    alert('Formulario enviado exitosamente!');

});
function formatDate(dateString) {
    // Convertir la cadena de fecha en un objeto Date
    const date = new Date(dateString);

    // Obtener los componentes de la fecha
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();

    // Obtener los componentes de la hora
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Formatear la fecha y la hora
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
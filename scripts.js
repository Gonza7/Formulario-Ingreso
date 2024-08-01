document.getElementById('solicitudForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Validación de campos
    const nombreSolicitante = document.getElementById('nombreSolicitante').value;
    const fechaHoraIngreso = document.getElementById('fechaHoraIngreso').value;
    const duracionActividad = document.getElementById('duracionActividad').value;
    const lugarUtilizar = document.getElementById('lugarUtilizar').value;
    const nombreResponsable = document.getElementById('nombreResponsable').value;
    const numeroTelefono = document.getElementById('numeroTelefono').value;

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
    doc.setFontSize(12);
    doc.text(`Solicitante: ${nombreSolicitante}`, 10, 10);
    doc.text(`Fecha y hora: ${fechaHoraIngreso}`, 10, 20);
    doc.text(`Duración: ${duracionActividad}`, 10, 30);
    doc.text(`Espacio a utilizar: ${lugarUtilizar}`, 10, 40);
    doc.text(`Responsable: ${nombreResponsable}`, 10, 50);
    doc.text(`Teléfono: ${numeroTelefono}`, 10, 60);

    // Descargar el PDF
    doc.save(`formulario_${nombreSolicitante}_${fechaHoraIngreso}.pdf`);
    alert('Formulario enviado exitosamente!');

    // Aquí puedes agregar la lógica para enviar los datos a un servidor
});

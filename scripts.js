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
    alert('Formulario enviado exitosamente!');
    // Aquí puedes agregar la lógica para enviar los datos a un servidor
});

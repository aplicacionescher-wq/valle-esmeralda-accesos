window.enviarWhats = async function() {
    const qrDiv = document.getElementById("qr");
    const btnWhats = document.getElementById("btnWhats");

    // 1. Validar que el QR exista
    if (!qrDiv.querySelector("img") && !qrDiv.querySelector("canvas")) {
        alert("Primero genera el código QR");
        return;
    }

    try {
        btnWhats.innerText = "⏳ Preparando imagen...";
        
        // 2. Convertir el DIV del QR en una imagen (Blob)
        const canvas = await html2canvas(qrDiv, {
            backgroundColor: "#ffffff", // Fondo blanco para que el QR sea legible
            scale: 2
        });

        canvas.toBlob(async (blob) => {
            const file = new File([blob], "Pase_Acceso.png", { type: "image/png" });

            // 3. Verificar si el dispositivo soporta compartir archivos (Web Share API)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Pase de Acceso Valle Esmeralda',
                        text: 'Hola, este es tu pase de acceso. Muéstralo en la entrada.'
                    });
                    btnWhats.innerText = "📱 Enviar por WhatsApp";
                } catch (shareError) {
                    // Si el usuario cancela el envío
                    console.log("Envío cancelado");
                    btnWhats.innerText = "📱 Enviar por WhatsApp";
                }
            } else {
                // FALLBACK: Si el navegador no soporta enviar archivos, enviamos el LINK
                const link = `https://valle-esmeralda-accesos.web.app/verqr.html?id=${window.currentQrID}`;
                const msg = encodeURIComponent(`Tu navegador no permite enviar imágenes. Usa este link: ${link}`);
                window.open(`https://wa.me/?text=${msg}`);
                btnWhats.innerText = "📱 Enviar por WhatsApp";
            }
        });

    } catch (err) {
        console.error("Error al procesar imagen:", err);
        alert("No se pudo generar la imagen. Se enviará el link por defecto.");
        // Fallback al link
        const link = `https://valle-esmeralda-accesos.web.app/verqr.html?id=${window.currentQrID}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(link)}`);
        btnWhats.innerText = "📱 Enviar por WhatsApp";
    }
};

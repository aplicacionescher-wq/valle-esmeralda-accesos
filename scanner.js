import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 FUNCIÓN PARA EXTRAER EL ID DEL QR
function obtenerID(qrTexto) {
  try {
    if (qrTexto.includes("id=")) {
      const url = new URL(qrTexto);
      return url.searchParams.get("id");
    }
    return qrTexto;
  } catch (e) {
    console.error("Error leyendo QR:", e);
    return null;
  }
}

// 🔥 INICIAR ESCÁNER
const html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras().then(cameras => {
  if (cameras && cameras.length) {

    html5QrCode.start(
      cameras[0].id,
      {
        fps: 10,
        qrbox: 250
      },
      async (decodedText) => {

        console.log("QR leído:", decodedText);

        const id = obtenerID(decodedText);

        if (!id) {
          alert("❌ QR inválido");
          return;
        }

        try {
          const ref = doc(db, "visitas", id);
          const snap = await getDoc(ref);

          if (!snap.exists()) {
            alert("❌ No existe registro");
            return;
          }

          const data = snap.data();

          // 🔥 VALIDAR ESTADO
          if (data.estado === "usado") {
            alert("⚠️ Este acceso ya fue utilizado");
            return;
          }

          // 🔥 ACTUALIZAR A USADO
          await updateDoc(ref, {
            estado: "usado",
            escaneadoEn: new Date().toLocaleString()
          });

          alert("✅ ACCESO PERMITIDO\n\n" +
                "Nombre: " + data.nombre + "\n" +
                "Casa: " + data.casa);

        } catch (error) {
          console.error(error);
          alert("❌ Error de conexión con Firebase");
        }

      },
      (errorMessage) => {
        // silencioso
      }
    );

  }
}).catch(err => {
  console.error(err);
  alert("❌ No se pudo acceder a la cámara");
});

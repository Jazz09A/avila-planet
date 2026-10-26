/**
 * Sección "cómo pedir" (id="como").
 *
 * Server component: tres pasos estáticos, sin interactividad.
 */
export function HowItWorks() {
  return (
    <section id="como">
      <div className="wrap">
        <h2 className="title">Tres pasos para el despegue</h2>
        <p className="sub">
          Sin llamadas ni esperas: tu pedido sale directo a cocina.
        </p>
        <div className="how">
          <div>
            <h3>Elige</h3>
            <p>Explora los planetas o el menú y agrega lo que se te antoje.</p>
          </div>
          <div>
            <h3>Confirma</h3>
            <p>Revisa tu pedido, deja tus datos y elige recoger o domicilio.</p>
          </div>
          <div>
            <h3>Recibe</h3>
            <p>Cocinamos al momento. Entre 15 y 30 minutos estás en órbita.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

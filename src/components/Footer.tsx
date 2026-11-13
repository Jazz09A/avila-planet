import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>
          Algo Diferente · Parrillas, hamburguesas y pepitos ·{" "}
          {/* Placeholder: sustituir por el Instagram real de la cadena. */}
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </span>
        <span>Abierto todos los días, 12:00 a 23:00</span>
        <Link className="btn-sm" href="/admin">
          Cocina
        </Link>
      </div>
    </footer>
  );
}

export default Footer;

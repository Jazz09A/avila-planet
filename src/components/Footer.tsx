import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>
          Ávila Planet · Hamburguesas de otro planeta ·{" "}
          <a
            href="https://www.instagram.com/avilaplanet/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @avilaplanet
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

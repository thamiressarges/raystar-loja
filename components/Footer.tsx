import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { getStoreInfo } from "@/services/store";

function getSocialLink(platform: 'facebook' | 'instagram', value: string | undefined): string {
  if (!value) return "#";
  if (value.startsWith("http")) return value;
  return platform === 'facebook' ? `https://facebook.com/${value}` : `https://instagram.com/${value}`;
}

export default async function Footer() {
  const storeInfo = await getStoreInfo();

  const email = storeInfo?.email ?? "contato@raystar.com.br";
  const phones = storeInfo?.phones || ["(99) 99999-9999"];
  const city = storeInfo?.address?.city ?? "Cidade";
  const state = storeInfo?.address?.state ?? "UF";

  const facebookUrl = getSocialLink('facebook', storeInfo?.social_media?.facebook);
  const instagramUrl = getSocialLink('instagram', storeInfo?.social_media?.instagram);

  return (
    <footer className="w-full bg-black text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          
          <div>
            <h2 className="text-2xl font-bold mb-4 font-logo tracking-wider">RAYSTAR</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Estilo que inspira. Peças modernas, confortáveis e com a identidade única que você procura.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Institucional</h3>
            <ul className="text-sm text-gray-400 space-y-3">
              <li>
                <Link href="/termos-de-uso" className="hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/trocas-e-devolucoes" className="hover:text-white transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Contato</h3>
            <ul className="text-sm text-gray-400 space-y-3">
              <li>{email}</li>
              {phones.map((p, i) => <li key={i}>{p}</li>)}
              <li>{city}, {state}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Redes Sociais</h3>
            <div className="flex gap-4">
              <Link 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all"
              >
                <Facebook size={20} />
              </Link>
              <Link 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all"
              >
                <Instagram size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Raystar Store. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'Quiénes somos y por qué creamos esta guía sobre home office y oficinas en casa.',
}

export default function SobreNosotros() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sobre Nosotros</h1>
      <div className="prose prose-gray max-w-none">

        <p className="lead text-lg text-gray-700">
          Somos apasionados del trabajo en casa que llevamos años equipando y optimizando nuestros espacios de trabajo.
          Esta web nació de una necesidad real: cuando empezamos a trabajar desde casa, había mucha información dispersa
          y pocas guías honestas en español.
        </p>

        <h2>¿Qué encontrarás aquí?</h2>
        <p>
          Analizamos y comparamos sillas ergonómicas, escritorios, monitores, iluminación y todo lo necesario para
          crear una oficina en casa que cuide tu salud, mejore tu productividad y se adapte a tu presupuesto.
        </p>
        <p>
          Cada recomendación está basada en investigación real: leemos cientos de opiniones, consultamos especificaciones
          técnicas y, cuando es posible, probamos los productos nosotros mismos.
        </p>

        <h2>Transparencia</h2>
        <p>
          Algunos enlaces de este sitio son de afiliado (principalmente Amazon). Si compras a través de ellos,
          recibimos una pequeña comisión sin ningún coste adicional para ti. Esto nos ayuda a mantener el sitio
          gratuito y actualizado.
        </p>
        <p>
          <strong>Nuestras recomendaciones son siempre honestas</strong> e independientes de si generamos comisión o no.
          Nunca recomendamos algo que no compraríamos nosotros mismos.
        </p>

        <h2>Contacto</h2>
        <p>
          Si tienes preguntas, sugerencias o quieres proponernos algo, escríbenos a{' '}
          <a href="mailto:comercial@rformas.es">comercial@rformas.es</a>.
        </p>

      </div>
    </div>
  )
}

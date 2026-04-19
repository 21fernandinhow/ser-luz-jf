<template>
  <div class="bg-surface-muted">
    <!-- Hero -->
    <section class="bg-brand-blue text-white">
      <div class="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 class="text-4xl sm:text-5xl font-bold leading-tight mb-4">
          Projeto Ser Luz
        </h1>
        <p class="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
          Levando esperança e apoio a famílias em situação de vulnerabilidade em Juiz de Fora.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/register?type=beneficiary"
            class="bg-white text-brand-blue font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition"
          >
            Preciso de Ajuda
          </NuxtLink>
          <NuxtLink
            to="/register?type=volunteer"
            class="bg-brand-yellow text-gray-900 font-semibold px-6 py-3 rounded-full hover:brightness-95 transition"
          >
            Quero Ajudar
          </NuxtLink>
          <button
            class="border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition"
            @click="openDonate"
          >
            Fazer Doação
          </button>
        </div>
      </div>
    </section>

    <!-- Quem somos -->
    <section class="max-w-5xl mx-auto px-6 py-16">
      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span class="text-xs font-semibold uppercase tracking-widest text-brand-blue">Quem somos</span>
          <h2 class="text-2xl font-bold text-gray-900 mt-2 mb-4">Uma ONG movida por amor ao próximo</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            O Projeto Ser Luz nasceu da vontade de transformar realidades. Atuamos diretamente junto a famílias que enfrentam dificuldades, oferecendo suporte por meio de doações de cestas básicas e outros recursos essenciais.
          </p>
          <p class="text-gray-600 leading-relaxed">
            Nosso trabalho é realizado por voluntários comprometidos que acreditam que pequenos gestos geram grandes mudanças.
          </p>
        </div>
        <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
          <div v-for="value in values" :key="value.title" class="flex gap-4 items-start">
            <div class="text-2xl">{{ value.icon }}</div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ value.title }}</h3>
              <p class="text-sm text-gray-500">{{ value.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Como funciona -->
    <section class="bg-white">
      <div class="max-w-5xl mx-auto px-6 py-16">
        <div class="text-center mb-12">
          <span class="text-xs font-semibold uppercase tracking-widest text-brand-blue">Como funciona</span>
          <h2 class="text-2xl font-bold text-gray-900 mt-2">Simples e transparente</h2>
        </div>
        <div class="grid sm:grid-cols-3 gap-8">
          <div v-for="step in steps" :key="step.number" class="text-center">
            <div class="w-12 h-12 rounded-full bg-brand-blue text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
              {{ step.number }}
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">{{ step.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
        <p class="text-center text-xs text-gray-400 mt-8">
          Após o cadastro, nossa equipe realiza a triagem manualmente. Não há aprovação automática.
        </p>
      </div>
    </section>

    <!-- Como ajudar -->
    <section class="max-w-5xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <span class="text-xs font-semibold uppercase tracking-widest text-brand-blue">Como ajudar</span>
        <h2 class="text-2xl font-bold text-gray-900 mt-2">Toda ajuda transforma</h2>
      </div>
      <div class="grid sm:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div class="text-4xl mb-4">🤝</div>
          <h3 class="font-bold text-gray-900 text-lg mb-2">Seja voluntário</h3>
          <p class="text-gray-500 text-sm mb-6 leading-relaxed">
            Doe seu tempo e habilidades. Ajudamos a conectar voluntários com as necessidades da ONG.
          </p>
          <NuxtLink
            to="/register?type=volunteer"
            class="inline-block bg-brand-blue text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-blue/90 transition"
          >
            Quero ser voluntário
          </NuxtLink>
        </div>
        <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div class="text-4xl mb-4">💛</div>
          <h3 class="font-bold text-gray-900 text-lg mb-2">Faça uma doação</h3>
          <p class="text-gray-500 text-sm mb-6 leading-relaxed">
            Doações financeiras e de itens essenciais são fundamentais para manter nossas ações ativas.
          </p>
          <button
            class="inline-block bg-brand-yellow text-gray-900 font-semibold px-6 py-3 rounded-full hover:brightness-95 transition"
            @click="openDonate"
          >
            Ver como doar
          </button>
        </div>
      </div>
    </section>

    <!-- Nossa história -->
    <section class="bg-white">
      <div class="max-w-5xl mx-auto px-6 py-16">
        <div class="text-center mb-12">
          <span class="text-xs font-semibold uppercase tracking-widest text-brand-blue">Nossa história</span>
          <h2 class="text-2xl font-bold text-gray-900 mt-2">De onde viemos e para onde vamos</h2>
        </div>

        <div class="space-y-16">
          <div class="flex flex-col md:flex-row gap-10 items-center">
            <div class="w-full md:w-1/2 shrink-0">
              <img src="/story-image-1.webp" alt="Projeto Ser Luz em ação" class="w-full aspect-[4/3] object-cover rounded-2xl" />
            </div>
            <div class="w-full md:w-1/2">
              <h3 class="text-xl font-bold text-gray-900 mb-4">O início de tudo</h3>
              <p class="text-gray-600 leading-relaxed mb-3">
                O Projeto Ser Luz nasceu há quase 10 anos com um propósito simples, mas poderoso: levar esperança onde muitas vezes ela já não existe. Ao longo dos anos, o Projeto Ser Luz transforma datas especiais em momentos inesquecíveis para crianças e famílias em situação de vulnerabilidade, por meio de ações como Páscoa Solidária, entrega de kits escolares, Dia das Crianças e Natal.
              </p>
              <p class="text-gray-600 leading-relaxed">
                Mas o que realmente move o projeto vai além das doações — é o carinho em cada gesto, o cuidado em cada detalhe e a certeza de que pequenas atitudes podem mudar histórias inteiras. Cada sorriso conquistado é uma prova de que a solidariedade ilumina caminhos.
              </p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row-reverse gap-10 items-center">
            <div class="w-full md:w-1/2 shrink-0">
              <img src="/story-image-2.webp" alt="Voluntários e famílias do Projeto Ser Luz" class="w-full aspect-[4/3] object-cover rounded-2xl" />
            </div>
            <div class="w-full md:w-1/2">
              <h3 class="text-xl font-bold text-gray-900 mb-4">A luz que cresce</h3>
              <p class="text-gray-600 leading-relaxed mb-3">
                Essa luz só cresce quando mais pessoas se unem. Seja como voluntário ou doador, você também pode fazer parte dessa transformação e levar esperança para quem mais precisa.
              </p>
              <blockquote class="border-l-4 border-brand-yellow pl-4 mt-6">
                <p class="text-gray-700 italic leading-relaxed">"Ser luz não é sobre brilhar, mas sim sobre iluminar caminhos."</p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="bg-brand-blue text-white">
      <div class="max-w-3xl mx-auto px-6 py-14 text-center">
        <h2 class="text-2xl font-bold mb-4">Você precisa de apoio?</h2>
        <p class="text-blue-100 mb-8 leading-relaxed">
          Faça seu cadastro gratuitamente. Nossa equipe analisará sua solicitação e entrará em contato. O processo é sigiloso e respeitoso.
        </p>
        <NuxtLink
          to="/register?type=beneficiary"
          class="inline-block bg-white text-brand-blue font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition"
        >
          Solicitar apoio
        </NuxtLink>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { open: openDonate } = useDonateModal()

const values = [
  { icon: '❤️', title: 'Solidariedade', description: 'Acreditamos que juntos somos mais fortes.' },
  { icon: '🔍', title: 'Transparência', description: 'Prestamos contas de cada ação realizada.' },
  { icon: '🌱', title: 'Dignidade', description: 'Tratamos cada pessoa com respeito e cuidado.' },
]

const steps = [
  { number: 1, title: 'Cadastre-se', description: 'Preencha o formulário de cadastro com seus dados. É gratuito e rápido.' },
  { number: 2, title: 'Aguarde a triagem', description: 'Nossa equipe analisa cada cadastro individualmente com atenção.' },
  { number: 3, title: 'Receba o retorno', description: 'Você será notificado sobre o status da sua solicitação pelo sistema.' },
]
</script>

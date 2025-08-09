<template>
  <div>
    <!-- Hero Section -->
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Sistema de Denúncia Anônima - 8º BPM da PMCE
      </h1>
      <p class="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
        Um canal seguro e confidencial para denúncias de tráfico de drogas, porte ilegal de armas, entre outros crimes.
        Sua identidade será completamente protegida.<br><br></br>
        <b>VICENTE PINZÓN, CAIS DO PORTO E MUCURIPE.</b>
      </p>
      <br></br>
      <!-- Garantias de Segurança -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-green-50 p-4 rounded-lg border border-green-200">
          <div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="font-semibold text-green-800 mb-1">100% Anônimo</h3>
          <p class="text-sm text-green-700">Não coletamos dados pessoais ou endereços IP</p>
        </div>
        
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="font-semibold text-blue-800 mb-1">Criptografado</h3>
          <p class="text-sm text-blue-700">Conexão SSL e dados protegidos</p>
        </div>
        
        <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div class="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="font-semibold text-purple-800 mb-1">Resposta Rápida</h3>
          <p class="text-sm text-purple-700">Denúncias são tratadas com prioridade</p>
        </div>
      </div>
    </div>

    <!-- Formulário Principal -->
    <DenunciaForm />

    <!-- Informações Adicionais -->
    <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Tipos de Denúncia -->
      <div class="card">
        <h3 class="text-xl font-bold text-gray-900 mb-4">O que você pode denunciar?</h3>
        <div class="space-y-3">
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 class="font-semibold text-gray-800">Porte ilegal de armas</h4>
              <p class="text-sm text-gray-600">Criminosos portando armas, munições, etc.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 class="font-semibold text-gray-800">Tráfico de drogas</h4>
              <p class="text-sm text-gray-600">Venda, compra, produção, transporte, etc, de drogas.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 class="font-semibold text-gray-800">Ameaças de facção</h4>
              <p class="text-sm text-gray-600">Ameaças de facção contra a população, etc.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 class="font-semibold text-gray-800">Disparos de arma de fogo</h4>
              <p class="text-sm text-gray-600">Disparos de arma de fogo contra a população, etc.</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 class="font-semibold text-gray-800">Outras Irregularidades</h4>
              <p class="text-sm text-gray-600">Qualquer situação inadequada não listada acima</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Como Funciona -->
      <div class="card">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Como funciona?</h3>
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">Preencha o formulário</h4>
              <p class="text-sm text-gray-600">Descreva a situação com detalhes, sem se identificar</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">Envio automático</h4>
              <p class="text-sm text-gray-600">Sua denúncia é enviada de forma segura e anônima</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">Análise responsável</h4>
              <p class="text-sm text-gray-600">A denúncia é analisada pelos responsáveis competentes</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">Ação corretiva</h4>
              <p class="text-sm text-gray-600">Medidas apropriadas são tomadas para resolver a situação</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div class="mt-12">
      <div class="card">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h3>
        
        <div class="space-y-4">
          <details class="group">
            <summary class="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span class="font-medium text-gray-800">Minha identidade realmente ficará protegida?</span>
              <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="mt-3 p-3 text-sm text-gray-600">
              Sim, absolutamente. Não coletamos endereços IP, não usamos cookies de rastreamento e todos os dados pessoais são automaticamente ofuscados. Sua privacidade é nossa prioridade máxima.
            </div>
          </details>

          <details class="group">
            <summary class="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span class="font-medium text-gray-800">O que acontece após enviar uma denúncia?</span>
              <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="mt-3 p-3 text-sm text-gray-600">
              Sua denúncia é enviada diretamente para os responsáveis competentes, que iniciarão uma investigação confidencial.
            </div>
          </details>

          <details class="group">
            <summary class="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span class="font-medium text-gray-800">Posso ser punido por fazer uma denúncia?</span>
              <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="mt-3 p-3 text-sm text-gray-600">
              Não. Denúncias feitas de boa-fé são protegidas contra retaliação. O sistema foi criado para encorajar o relato de irregularidades de forma segura.
            </div>
          </details>

          <details class="group">
            <summary class="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span class="font-medium text-gray-800">Preciso ter provas para fazer uma denúncia?</span>
              <svg class="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="mt-3 p-3 text-sm text-gray-600">
              Não é necessário ter provas físicas, mas forneça o máximo de detalhes possível sobre o ocorrido. Informações como datas, locais e testemunhas ajudam na investigação.
            </div>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuração da página
useHead({
  title: 'Sistema de Denúncia Anônima',
  meta: [
    { name: 'description', content: 'Canal seguro e anônimo para denúncias de irregularidades, assédio e discriminação' }
  ]
})
</script>
<template>
  <div class="card">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Nova Denúncia</h2>
      <p class="text-gray-600">
        Preencha o formulário abaixo de forma anônima. Seus dados pessoais não serão coletados.
      </p>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Tipo de Denúncia -->
      <div>
        <label for="tipo" class="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Denúncia *
        </label>
        <select
          id="tipo"
          v-model="form.tipo"
          class="form-select"
          :class="{ 'border-red-500': errors.tipo }"
        >
          <option value="porte">Porte ilegal de arma</option>
          <option value="trafico">Tráfico de drogas</option>
          <option value="ameaca">Ameaças de facção</option>
          <option value="disparos">Disparos de arma de fogo</option>
          <option value="outros">Outros</option>
        </select>
        <p v-if="errors.tipo" class="form-error">{{ errors.tipo }}</p>
      </div>

      <!-- Descrição -->
      <div>
        <label for="descricao" class="block text-sm font-medium text-gray-700 mb-2">
          Descrição da Denúncia *
        </label>
        <textarea
          id="descricao"
          v-model="form.descricao"
          class="form-textarea"
          :class="{ 'border-red-500': errors.descricao }"
          placeholder="Descreva os fatos de forma detalhada, incluindo datas, locais e pessoas envolvidas (sem identificar nomes reais se necessário)..."
          maxlength="2000"
        ></textarea>
        <div class="flex justify-between items-center mt-1">
          <p v-if="errors.descricao" class="form-error">{{ errors.descricao }}</p>
          <span class="text-xs text-gray-500">{{ (form.descricao ?? '').length }}/2000 caracteres</span>
        </div>
      </div>

      <!-- Local -->
      <div>
        <label for="local" class="block text-sm font-medium text-gray-700 mb-2">
          Local (opcional)
        </label>
        <input
          id="local"
          v-model="form.local"
          type="text"
          class="form-input"
          :class="{ 'border-red-500': errors.local }"
          placeholder="Ex: Setor X, Andar Y, Sala Z"
          maxlength="200"
        />
        <p v-if="errors.local" class="form-error">{{ errors.local }}</p>
      </div>

      <!-- Data -->
      <div>
        <label for="data" class="block text-sm font-medium text-gray-700 mb-2">
          Data do Ocorrido (opcional)
        </label>
        <input
          id="data"
          v-model="form.data"
          type="date"
          class="form-input"
          :class="{ 'border-red-500': errors.data }"
          :max="maxDate"
        />
        <p v-if="errors.data" class="form-error">{{ errors.data }}</p>
      </div>

      <!-- Urgência -->
      <div>
        <label for="urgencia" class="block text-sm font-medium text-gray-700 mb-2">
          Nível de Urgência *
        </label>
        <select
          id="urgencia"
          v-model="form.urgencia"
          class="form-select"
          :class="{ 'border-red-500': errors.urgencia }"
        >
          <option value="baixa">Baixa - Situação não urgente</option>
          <option value="media">Média - Requer atenção em breve</option>
          <option value="alta">Alta - Situação crítica</option>
        </select>
        <p v-if="errors.urgencia" class="form-error">{{ errors.urgencia }}</p>
      </div>

      <!-- Upload de Imagens -->
      <div>
        <label for="imagem" class="block text-sm font-medium text-gray-700 mb-2">
          Anexar Imagens (opcional, até 4)
        </label>
        <input
          id="imagem"
          type="file"
          @change="handleFileChange"
          accept="image/*"
          multiple
          class="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          :disabled="isCompressing || imageFiles.length >= 4"
        />
        <div v-if="isCompressing" class="flex items-center text-sm text-gray-600 mt-2">
          <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processando imagens...</span>
        </div>
        <div v-if="imagePreviews.length > 0" class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="(src, index) in imagePreviews" :key="index" class="relative">
            <img :src="src" alt="Preview da imagem" class="rounded-md w-full h-24 object-cover" />
            <button @click="removeImage(index)" type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 leading-none">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Barra de Progresso e Processamento -->
      <div v-if="isUploading || isProcessing">
        <div v-if="isUploading" class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: uploadProgress + '%' }"></div>
          <p class="text-center text-sm mt-1">{{ uploadProgress }}%</p>
        </div>
        <div v-if="isProcessing" class="flex items-center justify-center text-sm text-gray-600 mt-2">
          <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processando no servidor...</span>
        </div>
      </div>

      <!-- Informações de Privacidade -->
      <div class="alert-info">
        <div class="flex items-start space-x-2">
          <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm">
            <p class="font-medium mb-1">Garantia de Anonimato:</p>
            <ul class="space-y-1 text-xs">
              <li>• Não coletamos seu endereço IP</li>
              <li>• Dados pessoais são automaticamente ofuscados</li>
              <li>• Conexão protegida por SSL</li>
              <li>• Nenhum cookie de rastreamento</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Botões -->
      <div class="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          :disabled="isSubmitting || isCompressing || isUploading || isProcessing"
          class="btn-primary flex-1 flex items-center justify-center space-x-2"
        >
          <svg v-if="isSubmitting || isUploading || isProcessing" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isUploading ? `Enviando Mídia... (${uploadProgress}%)` : (isProcessing ? 'Processando...' : (isSubmitting ? 'Enviando...' : 'Enviar Denúncia')) }}</span>
        </button>
        
        <button
          type="button"
          @click="resetForm"
          class="btn-secondary flex-1"
          :disabled="isSubmitting || isCompressing || isUploading || isProcessing"
        >
          Limpar Formulário
        </button>
      </div>
    </form>

    <!-- Modal de Sucesso -->
    <div v-if="showSuccess" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Denúncia Enviada!</h3>
          <p class="text-sm text-gray-600 mb-4">
            A denúncia foi recebida com sucesso. Obrigado por contribuir com a segurança da sua comunidade.
          </p>
          <p class="text-xs text-gray-500 mb-4">
           Sua identidade permanece protegida.
          </p>
          <button @click="closeSuccessModal" class="btn-primary w-full">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import imageCompression from 'browser-image-compression'
import type { Denuncia, FormErrors } from '~/types'
import { validateDenuncia } from '~/utils/validation'

// Estado do formulário
const form = ref<Partial<Denuncia>>({
  tipo: undefined,
  descricao: '',
  local: '',
  data: '',
  urgencia: undefined
})

const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])
const isCompressing = ref(false)
const isUploading = ref(false)
const isProcessing = ref(false)
const uploadProgress = ref(0)

// Estado de validação e submissão
const errors = ref<FormErrors>({})
const isSubmitting = ref(false)
const showSuccess = ref(false)
const denunciaId = ref('')

// Data máxima (hoje)
const maxDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Função para lidar com a seleção de arquivos
async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])

  if (files.length === 0) return

  if (imageFiles.value.length + files.length > 4) {
    alert('Você pode enviar no máximo 4 imagens.')
    target.value = ''
    return
  }

  isCompressing.value = true
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`O arquivo '${file.name}' não é uma imagem e será ignorado.`)
        continue
      }
      const compressedFile = await imageCompression(file, options)
      imageFiles.value.push(compressedFile)
      imagePreviews.value.push(URL.createObjectURL(compressedFile))
    }
  } catch (error) {
    console.error('Erro ao comprimir imagens:', error)
    alert('Ocorreu um erro ao processar as imagens. Tente novamente.')
  } finally {
    isCompressing.value = false
    target.value = ''
  }
}

// Função para remover imagem
function removeImage(index: number) {
  imageFiles.value.splice(index, 1)
  const preview = imagePreviews.value.splice(index, 1)[0]
  if (preview) {
    URL.revokeObjectURL(preview)
  }
}

// Função para enviar formulário
async function submitForm() {
  const validation = validateDenuncia(form.value)
  errors.value = validation.errors
  
  if (!validation.isValid) {
    const firstErrorField = Object.keys(validation.errors)[0] || 'tipo'
    const element = document.getElementById(firstErrorField)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  
  isSubmitting.value = true
  
  const formData = new FormData()
  for (const key in form.value) {
    const value = form.value[key as keyof typeof form.value]
    if (value !== null && value !== undefined) {
      formData.append(key, value.toString())
    }
  }

  imageFiles.value.forEach((file) => {
    formData.append('imagens', file, file.name)
  })

  await new Promise<{ success: boolean; message: string; id: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    xhr.open('POST', '/api/denuncia', true)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        uploadProgress.value = percentComplete;
        if (percentComplete === 100) {
          isUploading.value = false;
          isProcessing.value = true;
        }
      }
    }

    xhr.onload = () => {
      isProcessing.value = false;
      isUploading.value = false;
      isSubmitting.value = false;
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText)
        if (response.success) {
          denunciaId.value = response.id
          showSuccess.value = true
          resetForm()
          resolve(response)
        } else {
          reject(new Error(response.message || 'Falha no envio'))
        }
      } else {
        reject(new Error(`${xhr.status}: ${xhr.statusText}`))
      }
    }

    xhr.onerror = () => {
      isProcessing.value = false;
      isUploading.value = false;
      isSubmitting.value = false;
      console.error('Erro de rede ao enviar denúncia:', xhr.statusText)
      alert('Erro de rede ao enviar denúncia. Verifique sua conexão e tente novamente.')
      reject(new Error('Erro de rede'))
    }

    if (imageFiles.value.length > 0) {
      isUploading.value = true;
    }
    xhr.send(formData)
  }).catch((error) => {
    console.error('Erro ao enviar denúncia:', error)
    alert('Erro ao enviar denúncia. Tente novamente.')
    isSubmitting.value = false
    isUploading.value = false
    isProcessing.value = false;
  })
}

// Função para limpar formulário
function resetForm() {
  form.value = {
    tipo: undefined,
    descricao: '',
    local: '',
    data: '',
    urgencia: undefined
  }
  errors.value = {}
  for (const preview of imagePreviews.value) {
    URL.revokeObjectURL(preview)
  }
  imageFiles.value = []
  imagePreviews.value = []
  uploadProgress.value = 0
  isProcessing.value = false
}

// Função para fechar modal de sucesso
function closeSuccessModal() {
  showSuccess.value = false
  denunciaId.value = ''
}
</script>

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import type { EnglishLevel } from '@/types'
import { DatePicker } from '@/components/ui/DatePicker'

const ENGLISH_LEVELS: EnglishLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export function Onboarding() {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>('B2')
  const setProfile = useStore((s) => s.setProfile)

  const handleFinish = () => {
    setProfile({
      id: crypto.randomUUID(),
      name: name || 'Usuário',
      englishLevel,
      yearsOfExperience: 0,
      challengeStartDate: startDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-neutral-900">
          Preparação 127D
        </h1>
        <p className="mt-2 text-neutral-500">
          Preencha os dados para começar o desafio.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Seu nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Nível de inglês
            </label>
            <p className="mt-1 text-xs text-neutral-500">
              Se for menor que B2, o estudo de inglês (30 min/dia) será obrigatório.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ENGLISH_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEnglishLevel(level)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    englishLevel === level
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Data de início do desafio
            </label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="Selecione a data de início"
              className="mt-1 w-full"
            />
            <p className="mt-2 text-xs text-neutral-500">
              O desafio dura 127 dias (segunda a segunda).
            </p>
          </div>
          <button
            type="button"
            onClick={handleFinish}
            disabled={!startDate}
            className="w-full rounded-xl bg-neutral-900 py-3 font-semibold text-white disabled:opacity-50"
          >
            Iniciar desafio
          </button>
        </div>
      </div>
    </div>
  )
}

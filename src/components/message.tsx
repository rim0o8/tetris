'use client'

import { useTranslation } from 'react-i18next'

export function Message() {
  const { t } = useTranslation()
  return <h1>{t('message')}</h1>
}

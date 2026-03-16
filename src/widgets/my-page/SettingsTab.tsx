'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, LogOut, Pencil, UserX } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Switch } from '@/shared/ui/switch'
import { Separator } from '@/shared/ui/separator'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/ui/alert-dialog'
import { AccountDeleteDialog } from './AccountDeleteDialog'
import { logout } from '@/features/auth/api/logout'
import { tokenStore } from '@/shared/api'
import type { User } from '@/shared/types'

interface SettingsTabProps {
  user: User
  onUpdateUser: (updates: Partial<Pick<User, 'name' | 'email'>>) => void
}

export function SettingsTab({ user, onUpdateUser }: SettingsTabProps) {
  const router = useRouter()

  // Profile editing
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user.name)
  const [editEmail, setEditEmail] = useState(user.email)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [emailError, setEmailError] = useState('')

  // Notification toggles
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  // Account action dialogs
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Sync edit fields when user data changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditName(user.name)
      setEditEmail(user.email)
    }
  }, [user.name, user.email, isEditing])

  const handleStartEdit = () => {
    setEditName(user.name)
    setEditEmail(user.email)
    setEmailError('')
    setSaveSuccess(false)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditName(user.name)
    setEditEmail(user.email)
    setEmailError('')
    setIsEditing(false)
  }

  const handleSave = () => {
    // Validate email
    if (!/.+@.+\..+/.test(editEmail)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.')
      return
    }
    setEmailError('')
    setIsSaving(true)

    setTimeout(() => {
      onUpdateUser({ name: editName, email: editEmail })
      setIsSaving(false)
      setIsEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Profile */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold">프로필 정보</h3>

        {!isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">이름</p>
                <p className="text-sm font-medium">{user.name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartEdit}
                className="gap-1.5"
              >
                <Pencil size={14} />
                수정
              </Button>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">이메일</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            {saveSuccess && (
              <p className="flex items-center gap-1.5 text-sm text-green-600">
                <Check size={14} />
                저장되었습니다
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">이름</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">이메일</Label>
              <Input
                id="edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => {
                  setEditEmail(e.target.value)
                  if (emailError) setEmailError('')
                }}
                aria-invalid={!!emailError}
                disabled={isSaving}
              />
              {emailError && (
                <p className="text-sm text-destructive">{emailError}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                취소
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving || !editName.trim()} className="gap-1.5">
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    저장 중...
                  </>
                ) : (
                  '저장'
                )}
              </Button>
            </div>
          </div>
        )}
      </section>

      <Separator />

      {/* Section 2: Notification Settings */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold">알림 설정</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">마케팅 수신 동의</Label>
              <p className="text-sm text-muted-foreground">
                프로모션 및 이벤트 정보를 받습니다
              </p>
            </div>
            <Switch
              id="marketing"
              checked={marketingConsent}
              onCheckedChange={setMarketingConsent}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="push">푸시 알림</Label>
              <p className="text-sm text-muted-foreground">
                예매, 양도 등 중요 알림을 받습니다
              </p>
            </div>
            <Switch
              id="push"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="sms">SMS 알림</Label>
              <p className="text-sm text-muted-foreground">
                문자로 알림을 받습니다
              </p>
            </div>
            <Switch
              id="sms"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Section 3: Account Actions */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold">계정 관리</h3>

        <div className="flex flex-col gap-3 items-start">
          <Button
            variant="outline"
            onClick={() => setLogoutDialogOpen(true)}
            className="gap-2"
          >
            <LogOut size={16} />
            로그아웃
          </Button>

          <Button
            variant="ghost"
            onClick={() => setDeleteDialogOpen(true)}
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <UserX size={16} />
            계정 탈퇴
          </Button>
        </div>
      </section>

      {/* Logout Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그아웃하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              로그아웃하면 다시 로그인해야 합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await logout().catch(() => {})
                tokenStore.clearToken()
                router.replace('/onboarding')
              }}
            >
              로그아웃
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Account Delete Dialog */}
      <AccountDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  )
}

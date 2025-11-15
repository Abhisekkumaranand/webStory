import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface SignupFormProps extends React.ComponentProps<typeof Card> {
  name: string
  email: string
  password: string
  role: string
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent) => void
  errors: { name?: string; email?: string; password?: string; general?: string }
  loading: boolean
}

export function SignupForm({
  name,
  email,
  password,
  role,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onRoleChange,
  onSubmit,
  errors,
  loading,
  ...props
}: SignupFormProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={onNameChange}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={onEmailChange}
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={onPasswordChange}
                required
              />
              <FieldDescription>
                Must be at least 6 characters long.
              </FieldDescription>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <select
                id="role"
                value={role}
                onChange={onRoleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
              {/* <Button variant="outline" type="button">
                Sign up with Google
              </Button> */}
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

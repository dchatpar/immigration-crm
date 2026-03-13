import { NextResponse } from 'next/server'

// Demo users database (in production, use a real database)
const DEMO_USERS = [
  {
    id: 'demo-user-1',
    email: 'demo@immigrationcrm.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'ADMIN',
    department: 'Management'
  },
  {
    id: 'admin-1',
    email: 'admin@immigrationcrm.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN',
    department: 'Management'
  },
  {
    id: 'staff-1',
    email: 'staff@immigrationcrm.com',
    password: 'staff123',
    name: 'Staff Member',
    role: 'STAFF',
    department: 'Operations'
  }
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, demo } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For demo mode, check against demo users
    if (demo) {
      const user = DEMO_USERS.find(u => u.email === email && u.password === password)
      
      if (user) {
        // Create a simple token (in production, use proper JWT)
        const token = Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString('base64')
        
        return NextResponse.json({
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department
          }
        })
      }
    }

    // Check against demo users
    const user = DEMO_USERS.find(u => u.email === email && u.password === password)
    
    if (user) {
      // Create a simple token (in production, use proper JWT)
      const token = Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString('base64')
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department
        }
      })
    }

    // No user found
    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}

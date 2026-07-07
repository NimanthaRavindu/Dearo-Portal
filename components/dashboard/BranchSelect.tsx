import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function BranchSearch() {

  const branches = await prisma.branch.findMany()

  return (
    <div className="p-4">
      <label className="block mb-2 font-bold">Select Branch:</label>
      <select className="w-full p-2 border rounded shadow-sm">
        <option value="">-- Choose a Branch --</option>
        
        
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.branch_name}
          </option>
        ))}
      </select>
    </div>
  )
}

"use server"
import {prisma} from "@/lib/db";

export async function getAllBranchData() {
  const [accounts,loans,investments] = await Promise.all([
     prisma.account.findMany({include:{branch:true}}),
     prisma.loan.findMany({include:{branch:true}}),
     prisma.investment.findMany({include:{branch:true}}),   
  ]);  

  const allDocuments = [
    ...accounts.map(a =>({id:a.id,docNo:a.account_number,type:'Account',branch:a.branch.branch_name,link:`/dashboard/branches/${a.id}`})),
    ...loans.map(l => ({id:l.id,docNo:l.contract_no,type:'Loan',branch:l.branch.branch_name,link:`/dashboard/branches/${l.branchId}/loans/${l.id}`})),
    ...investments.map(i =>({id:i.id,docNo:i.contract_no,type:'Investment',branch:i.branch.branch_name,link:`/dashboard/branches/${i.branchId}/investments/${i.id}`}))
  ];
  
  return {
    totalAccounts : accounts.length,
    totalLoans  :   loans.length,
    totalInvestments :investments.length,
    allDocuments
    };
}

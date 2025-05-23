import type { User } from "./user"

export interface Application {
    id: number
    device_model: string
    issue_type: string
    problem_area: string
    price: number
    description: string
    estimated_completion: number
    end_time: string
    location: string
    status: string
    created_at: string
    master: User
    owner: User
}
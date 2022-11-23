import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { cyclesReducer, CycleType } from '../reducers/cycles/reducer'

interface CreateCycleDataType {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: CycleType[]
  activeCycle: CycleType | undefined
  activeCycleId: string | undefined
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  interruptCurrentCycle: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleDataType) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderPropsType {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderPropsType) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: '',
    },
    (initialArg) => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-countdown:cycle-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return initialArg
    },
  )

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem('@ignite-countdown:cycle-state-1.0.0', stateJSON)
  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateCycleDataType) {
    const newCycle: CycleType = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        setSecondsPassed,
        interruptCurrentCycle,
        createNewCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

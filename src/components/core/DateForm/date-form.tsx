'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { TimePicker } from '@/components/core/DateForm/TimePicker/time-picker'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { DateRange } from 'react-day-picker'
import { Spinner } from '@/components/ui/spinner'
import { apiInstance } from '@/services/axios/instances'
import { useRouter } from 'next/navigation'
import { adjustDates, toUnix } from '@/lib/date'
import { fetchProductiveUnits } from '@/services/api/units'
import ProductiveUnit from '@/types/productive-unit'

const formSchema = (timeForRange: Date, currentDate: Date) => z.object({ // bruh
    dateRange: z.object({
        dateFrom: z.date({
            required_error: "Uma data inicial é requerida",
            invalid_type_error: "Uma data inicial é requerida",
        }),
        dateTo: z.date({
            required_error: "Uma data final é requerida",
            invalid_type_error: "Uma data final é requerida",
        }),
    }),
    dateAccommodation: z.date(),
    unit: z.string({
        message: "Escolha uma unidade produtiva",
    }).nonempty({
        message: "Escolha uma unidade produtiva",
    }),
}).superRefine((data, ctx) => {
    const { dateFrom, dateTo } = adjustDates(data.dateRange.dateFrom, data.dateRange.dateTo, data.dateAccommodation, timeForRange, currentDate) // need to adjust dates before comparing
    if (data.dateAccommodation >= dateTo) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Data de alojamento deve ser antes da data final",
            path: ["dateAccommodation"],
        })
    } else if (dateTo.getTime() - dateFrom.getTime() > 1000 * 60 * 60 * 24 * 7 * 4) { // 4 weeks range
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Período escolhido não pode ser maior que 4 semanas",
        })
    }
})

type FormSchemaType = z.infer<ReturnType<typeof formSchema>>;
const DateForm = () => {
    const router = useRouter()

    const [apiKey, setApiKey] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<Date>()
    const [units, setUnits] = useState<ProductiveUnit[]>([])
    useEffect(() => {
        const fetchData = async () => {
            setCurrentDate(new Date(Date.now()))
            setDateRange({
                from: new Date(Date.now()),
                to: new Date(Date.now()),
            })
            setTimeForRange(new Date(Date.now()))
            form.setValue('dateAccommodation', new Date(Date.now()))

            const username: string | undefined = process.env.NEXT_PUBLIC_API_USERNAME
            const password: string | undefined = process.env.NEXT_PUBLIC_API_PASSWORD

            if (!username || !password) {
                toast({
                    title: "Erro de configuração",
                    description: "Credenciais da API não configuradas - Contate o suporte",
                    duration: 2000
                })
                setTimeout(() => {
                    router.push('/')
                }, 2000)
            }

            apiInstance.post('/api/token/', {
                username: username,
                password: password,
            }).then(async (response) => {
                setApiKey(response.data.access)
                setUnits(await fetchProductiveUnits(response.data.access))
            }).catch((error) => {
                toast({
                    title: "Erro no servidor",
                    description: "Não foi possível obter as credenciais da API - Contate o suporte",
                    duration: 2000
                })
                setTimeout(() => {
                    router.push('/')
                }, 2000)
            })
        }
        fetchData()
    }, [router])

    const [loading, setLoading] = useState(false);
    function onSubmit(data: FormSchemaType) { // uses apikey, startdate, enddate, accommodationdate and unitid
        setLoading(true)
        const { dateFrom, dateTo } = adjustDates(data.dateRange.dateFrom, data.dateRange.dateTo, data.dateAccommodation, timeForRange, currentDate)
        if (dateTo.getTime() - dateFrom.getTime() > 1000 * 60 * 60 * 24 * 7 * 4) { // 4 weeks range
            toast({
                variant: "destructive",
                title: "Período muito longo",
                description: "Período escolhido não pode ser maior que 8 semanas",
                duration: 3500
            })
            setLoading(false)
            return
        }

        const unixDateFrom = toUnix(dateFrom)
        const unixDateTo = toUnix(dateTo)
        const key = apiKey
        const unitId = data.unit
        let unixDateAccommodation = toUnix(data.dateAccommodation)
        if (useSavedAccommodationDate) {
            const unit = units.find((unit) => unit.id === unitId)
            if (unit && unit.installation_date) {
                let [day, month, year] = unit.installation_date.split('/');
                let date = new Date(`${year}-${month}-${day}T00:00:00`);
                unixDateAccommodation = toUnix(date)
            }
        }

        apiInstance.get('/reports/get_chicken_week_report', {
            headers: {
                Authorization: `Bearer ${key}`
            },
            params: {
                unix_timestamp_ini: unixDateFrom,
                unix_timestamp_end: unixDateTo,
                unit_id: unitId,
                unix_installation_date: unixDateAccommodation,
            }
        }).then((response) => {
            if (response.status === 204) { // no-content
                toast({
                    variant: "destructive",
                    title: "Sem dados",
                    description: "Não há dados para o período selecionado ou para unidade selecionada",
                    duration: 3500
                })
                setLoading(false)
                return
            }
            const url = response.data.download_url
            const link = document.createElement('a')
            link.href = url
            link.download = 'relatório_gerado.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setLoading(false)
        }).catch((error) => {
            if (error.response.data?.error === "no_devices_in_uni_prod") {
                toast({
                    variant: "destructive",
                    title: "Erro no servidor",
                    description: "Não há dispositivos cadastrados para essa unidade produtiva",
                    duration: 3500
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro no servidor",
                    description: "Não foi possível obter o relatório - Contate o suporte",
                    duration: 3500
                })
            }
            setLoading(false)
        })
    }

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: currentDate,
        to: currentDate,
    })
    const [timeForRange, setTimeForRange] = useState<Date | undefined>() // only contains the time and currentDate
    function handleDateRangeChange(newDateRange: DateRange | undefined) {
        if (newDateRange && newDateRange.from && newDateRange.to) {
            setDateRange({ from: new Date(newDateRange.from), to: new Date(newDateRange.to) })
            form.setValue('dateRange.dateFrom', newDateRange.from)
            form.setValue('dateRange.dateTo', newDateRange.to)
        }
    }

    function handleTimeRangeChange(newTime: Date | undefined) { // saves the time in a different place
        if (newTime) {
            setTimeForRange(newTime)
        }
    }

    const [useSavedAccommodationDate, setUseSavedAccommodationDate] = useState<boolean>(false) // for using the fetched accommodation date for the unit
    function handleSetUseSavedAccommodationDate() {
        setUseSavedAccommodationDate(!useSavedAccommodationDate)
        const unit = units.find((unit) => unit.id === form.getValues('unit'))
        if (unit && unit.installation_date) {
            let [day, month, year] = unit.installation_date.split('/');
            let date = new Date(`${year}-${month}-${day}T00:00:00`);
            form.setValue('dateAccommodation', date)
        }
    }

    function handleUnitChange() {
        if (useSavedAccommodationDate) {
            const unit = units.find((unit) => unit.id === form.getValues('unit'))
            if (unit && unit.installation_date) {
                let [day, month, year] = unit.installation_date.split('/');
                let date = new Date(`${year}-${month}-${day}T00:00:00`);
                form.setValue('dateAccommodation', date)
            }
        }
    }

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema(timeForRange ?? new Date(Date.now()), currentDate ?? new Date(Date.now()))),
    })

    return (
        <Form {...form}>
            <form
                className="flex items-center gap-6 justify-center flex-col w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] h-auto"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-10">
                    <FormField
                        control={form.control}
                        name="dateRange"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-left">Escolha o período</FormLabel>
                                <Popover>
                                    <div className="flex flex-col gap-1">
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="dateRange"
                                                variant={"outline"}
                                                className={cn(
                                                    "justify-start text-left font-normal",
                                                    !dateRange && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon />
                                                {dateRange?.from ? (
                                                    dateRange.to ? (
                                                        <div className="flex text-wrap">
                                                            {format(dateRange.from, "PPP", { locale: ptBR })} -{" "}
                                                            {format(dateRange.to, "PPP", { locale: ptBR })}
                                                            {format(timeForRange ?? dateRange.to, " HH:mm:ss", { locale: ptBR })}
                                                        </div>
                                                    ) : (
                                                        format(dateRange.from, "PPP HH:mm:ss", { locale: ptBR })
                                                    )
                                                ) : (
                                                    <span>Escolha uma data inicial e final</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <FormMessage />
                                    </div>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={dateRange?.from}
                                            selected={dateRange}
                                            onSelect={handleDateRangeChange}
                                            numberOfMonths={2}
                                        />
                                        <div className="p-3 border-t border-border">
                                            <TimePicker
                                                setDate={(date) => {
                                                    handleTimeRangeChange(date)
                                                }}
                                                date={timeForRange}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dateAccommodation"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className={`text-left ${useSavedAccommodationDate ? "text-gray-400" : ""}`}>Escolha a data e hora de alojamento</FormLabel>
                                <Popover>
                                    <FormControl>
                                        <div className='flex flex-col gap-1'>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={useSavedAccommodationDate}
                                                >
                                                    <CalendarIcon className="h-4 w-4" />
                                                    {field.value ? (
                                                        format(field.value, "PPP HH:mm:ss", { locale: ptBR })
                                                    ) : (
                                                        <span>Escolha uma data e hora</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <FormMessage />
                                        </div>
                                    </FormControl>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        <div className="p-3 border-t border-border">
                                            <TimePicker
                                                setDate={field.onChange}
                                                date={field.value}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-left">Escolha a unidade produtiva</FormLabel>
                                <div className="flex w-auto gap-4 items-center md:flex-nowrap flex-wrap justify-between">
                                    <FormControl>
                                        <Select onValueChange={(value) => {
                                            field.onChange(value)
                                            handleUnitChange()
                                        }}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-[65%]" >
                                                <SelectValue placeholder="Unidade Produtiva" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {units.map((unit) => (
                                                    <SelectItem key={unit.id} value={unit.id} className="cursor-pointer">
                                                        {unit.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <div className="flex items-center gap-2 w-full justify-center">
                                        <div className="flex items-center w-auto">
                                            {units.find((unit) => unit.id === field.value)?.installation_date && (
                                                <p className={`border shadows-md text-xs rounded-md px-2 py-1.5 w-full tracking-tighter text-nowrap ${useSavedAccommodationDate ? "text-popover-foreground border-black" : "text-muted-foreground"}`}>{units.find((unit) => unit.id === field.value)?.installation_date} 00:00</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox checked={useSavedAccommodationDate} onCheckedChange={() => handleSetUseSavedAccommodationDate()} />
                                            <p className="text-xs leading-none tracking-tight inline-block w-auto">Usar data de alojamento já cadastrada?</p>
                                        </div>
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    type="submit"
                    loader={<Spinner />}
                    loading={loading}
                    disabled={loading}
                >
                    Gerar relatório
                </Button>
            </form>
        </Form >
    )
}
DateForm.displayName = 'DateForm'

export { DateForm }

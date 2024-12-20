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
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { DateRange } from 'react-day-picker'
import { Spinner } from '@/components/ui/spinner'
import { apiInstance } from '@/services/axios/instances'
import { useRouter } from 'next/navigation'
import { adjustDates, toUnix } from '@/lib/date'
import { getProductiveUnits } from '@/services/api/units'
import ProductiveUnit from '@/types/productive-unit'

const formSchema = (timeForRange: Date, currentDate: Date) => z.object({ // bruh
    dateRange: z.object({
        dateFrom: z.date({
            required_error: "Uma data inicial é requerida",
        }),
        dateTo: z.date({
            required_error: "Uma data final é requerida",
        }),
    }),
    dateAccommodation: z.date({
        required_error: "Uma data de alojamento é requerida",
        invalid_type_error: "Data de alojamento inválida",
    }),
    unit: z.string({
        message: "Escolha uma unidade produtiva",
    }).nonempty({
        message: "Escolha uma unidade produtiva",
    }),
}).superRefine((data, ctx) => {
    const { dateFrom, dateTo } = adjustDates(data.dateRange.dateFrom, data.dateRange.dateTo, data.dateAccommodation, timeForRange, currentDate) // need to adjust dates before comparing
    if (data.dateAccommodation <= dateFrom || data.dateAccommodation >= dateTo) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Data de alojamento deve estar entre o período escolhido",
            path: ["dateAccommodation"],
        });
    }
});

type FormSchemaType = z.infer<ReturnType<typeof formSchema>>;
const DateForm = () => {
    const router = useRouter()

    const [apiKey, setApiKey] = useState<string | undefined>(undefined);
    const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
    const [units, setUnits] = useState<ProductiveUnit[]>([])
    useEffect(() => {
        const fetchData = async () => {
            setCurrentDate(new Date(Date.now()))
            setDateRange({
                from: new Date(Date.now()),
                to: new Date(Date.now()),
            })
            apiInstance.get('/api/api', {
                params: {
                    user: process.env.NEXT_PUBLIC_API_USERNAME,
                    password: process.env.NEXT_PUBLIC_API_PASSWORD,
                }
            }).then((response) => {
                setApiKey(response.data.key) // TODO: fix this
            }).catch((error) => {
                toast({
                    title: "Erro no servidor",
                    description: "Não foi possível obter as credenciais da API - Contate o suporte",
                    duration: 2000
                })
                //router.push('/') // TODO: re-add line
            })
            setUnits(await getProductiveUnits())
        }
        fetchData()
    }, [router])

    const [loading, setLoading] = useState(false);
    function onSubmit(data: FormSchemaType) { // uses apikey, startdate, enddate, accommodationdate and unitid
        setLoading(true)
        const { dateFrom, dateTo } = adjustDates(data.dateRange.dateFrom, data.dateRange.dateTo, data.dateAccommodation, timeForRange, currentDate)
        const unixDateFrom = toUnix(dateFrom)
        const unixDateTo = toUnix(dateTo)
        const unixDateAccommodation = toUnix(data.dateAccommodation)
        // TODO: send api request with data, also use key and unitid

        console.log("Sent data: " + JSON.stringify({ // TODO: remove this
            apiKey: apiKey,
            startDate: unixDateFrom,
            endDate: unixDateTo,
            accommodationDate: unixDateAccommodation,
            unitId: data.unit,
        }))

        setLoading(false)
    }

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: currentDate,
        to: currentDate,
    })
    const [timeForRange, setTimeForRange] = useState<Date | undefined>(currentDate) // only contains the time and currentDate
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

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema(timeForRange ?? new Date(Date.now()), currentDate ?? new Date(Date.now()))),
    })

    return (
        <Form {...form}>
            <form
                className="flex items-center gap-4 justify-center flex-col"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-5">
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
                                                        <>
                                                            {format(dateRange.from, "PPP", { locale: ptBR })} -{" "}
                                                            {format(dateRange.to, "PPP", { locale: ptBR })}
                                                            {format(timeForRange ?? dateRange.to, " HH:mm:ss", { locale: ptBR })}
                                                        </>
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
                                <FormLabel className="text-left">Escolha a data e hora de alojamento</FormLabel>
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
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Unidade Produtiva" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {units.map((unit) => (
                                                <SelectItem key={unit.id} value={unit.id}>
                                                    {unit.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    type="submit"
                    loader={
                        <Spinner />
                    }
                    loading={loading}
                >
                    Gerar relatório
                </Button>
            </form>
        </Form >
    )
}
DateForm.displayName = 'DateForm'

export { DateForm }

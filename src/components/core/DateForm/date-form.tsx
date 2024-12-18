'use client'

import React, { useState } from 'react'
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
import { TimePicker } from '@/components/core/DateForm/TimePicker/time-picker'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { DateRange } from 'react-day-picker'
import { Spinner } from '@/components/ui/spinner'

const formSchema = z.object({
    dateRange: z.object({
        dateFrom: z.date(),
        dateTo: z.date(),
    }),
    dateAccommodation: z.date(),
})

type FormSchemaType = z.infer<typeof formSchema>;

const DateForm = () => {

    const [currentDate, setCurrentDate] = useState<Date>(new Date(Date.now()))

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    })

    const [loading, setLoading] = useState(false);

    function onSubmit(data: FormSchemaType) {
        toast({
            title: "TODO (delete): You submitted the following values:",
            description: (
                <pre>
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: currentDate,
        to: currentDate,
    })
    const [timeForRange, setTimeForRange] = useState<Date | undefined>(currentDate) // only contains the time and currentDate
    // const [dateAccommodation, setDateAccommodation] = useState<Date | undefined>(currentDate)

    function handleDateRangeChange(newDateRange: DateRange | undefined) {
        if (newDateRange?.from && newDateRange?.to) {
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
                            < FormItem className="flex flex-col">
                                <FormLabel className="text-left">Escolha a data e hora de alojamento</FormLabel>
                                <Popover>
                                    <FormControl>
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

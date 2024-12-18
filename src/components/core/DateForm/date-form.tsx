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

const formSchema = z.object({
    dateTime: z.date(),
})

type FormSchemaType = z.infer<typeof formSchema>;

const DateForm = () => {
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    })

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
        from: new Date(Date.now()),
        to: new Date(Date.now()),
    })

    function handleDateChange(newDateRange: DateRange | undefined) {
        if (newDateRange?.from) {
            const newDate = new Date(newDateRange.from);
            setDateRange({ from: newDate, to: newDate });
            form.setValue('dateTime', newDate);
        }
    }


    return (
        <Form {...form}>
            <form
                className="flex items-center gap-4 justify-center flex-col"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="dateTime"
                    render={({ field }) => (
                        <div className="flex flex-col gap-5">
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-left">Escolha o período</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                "w-[300px] justify-start text-left font-normal",
                                                !dateRange && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon />
                                            {dateRange?.from ? (
                                                dateRange.to ? (
                                                    <>
                                                        {format(dateRange.from, "PPP", { locale: ptBR })} -{" "}
                                                        {format(dateRange.to, "PPP", { locale: ptBR })}
                                                        {format(dateRange.to, " HH:mm:ss", { locale: ptBR })}
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
                                            onSelect={setDateRange}
                                            numberOfMonths={2}
                                        />
                                        <div className="p-3 border-t border-border">
                                            <TimePicker
                                                setDate={(date) => {
                                                    handleDateChange({
                                                        ...dateRange,
                                                        from: date,
                                                    })
                                                }}
                                                date={field.value}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-left">Escolha a data e hora de alojamento</FormLabel>
                                <Popover>
                                    <FormControl>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-[280px] justify-start text-left font-normal",
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
                        </div>
                    )}
                />
                <Button type="submit" loader={
                    <p>hello</p>
                } loading={true}>Gerar relatório</Button>
            </form>
        </Form>
    )
}
DateForm.displayName = 'DateForm'

export { DateForm }

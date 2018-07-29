import * as cheerio from 'cheerio';
import { omit } from 'lodash';
import { ParsedRow, RawRow } from "../../entities/Row";

export const parseScgAnswer = (input: string) => {
    const dom = cheerio.load(input);
    const rows = dom('#content table table tr');
    const parsedRows = [];
    if (rows.length > 1) {
        rows.each((index, row) => {
            if (!row.attribs[ 'class' ] || !row.attribs[ 'class' ].includes('deckdbbody')) return;
            let parsedRow = {} as any;
            dom(row).children().each((columnIndex, column) => {
                if (!column.attribs || !column.attribs[ 'class' ] || !column.attribs[ 'class' ].includes('search_results_')) return;
                const index = parseInt(column.attribs[ 'class' ].match(/search_results_(\d+)/i)[ 1 ]);
                parsedRow = {
                    ...parsedRow,
                    ...parseRow(column, index)
                };
            });
            const preparedRow = prepareRow(parsedRow);
            !!parsedRow.name.value
                ? parsedRows.push(preparedRow)
                : parsedRows[ parsedRows.length - 1 ].cards.push(preparedRow.cards[0]);
        });
    }
    return parsedRows;
};

const columnMap = {
    '1': 'name',
    '2': 'set',
    '3': 'mana',
    '4': 'type',
    '5': 'pt',
    '6': 'rarity',
    '7': 'condition',
    '8': 'stock',
    '9': 'price',
};

const prepareRow = (raw: RawRow): ParsedRow => {
    const name = raw.name;
    const set = raw.set;
    const cards = [ omit(raw, [ 'name, set' ]) ];
    return {
        name,
        set,
        cards,
    }
};

const parseRow = (element: CheerioElement, index: number) => {
    switch (index) {
        case 1:
            return { [ columnMap[ +index ] ]: parseName(element) };
        case 2:
        case 7:
            return { [ columnMap[ +index ] ]: parseLink(element) };
        case 3:
        case 4:
        case 5:
        case 6:
        case 8:
        case 9:
            return { [ columnMap[ +index ] ]: parseText(element) };
    }
};

const parseName = (element: CheerioElement) => {
    const aElement = cheerio.load(element)('a');
    return {
        href: aElement.attr('href'),
        value: ((aElement.text() || '').match(/^\s*(.+)\s*$/i) || [ '' ])[ 1 ],
        img: ((aElement.attr('rel') || '').match(/src='([.\S]+)'/i) || [ '' ])[ 1 ]
    };
};

const parseLink = (element: CheerioElement) => {
    const aElement = cheerio.load(element)('a');
    return {
        href: aElement.attr('href'),
        value: ((aElement.text() || '').match(/^\s*(.+)\s*$/i) || [ '' ])[ 1 ],
    };
};

const parseText = (element: CheerioElement) => cheerio.load(element)('td').text();
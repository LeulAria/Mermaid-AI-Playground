import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const FeaturesCard = () => {
  return (
    <div className='nfont flex *:rounded-none *:shadow-none max-xl:flex-col max-xl:*:not-last:border-b-0 max-xl:*:first:rounded-t-xl max-xl:*:last:rounded-b-xl xl:*:not-last:border-r-0 xl:*:first:rounded-l-xl xl:*:last:rounded-r-xl'>
      <Card className='overflow-hidden pt-0'>
        <CardContent className='px-0'>
          <img
            src='/hero-img.jpg'
            alt='Prompt to diagram preview'
            className='aspect-video w-92 object-cover'
          />
        </CardContent>
        <CardHeader>
          <CardTitle>Prompt-to-Diagram in Seconds</CardTitle>
          <CardDescription>
            Describe your flow or architecture in plain text and let Mermaid AI craft clean, standards-compliant
            diagrams instantly—no syntax knowledge required.
          </CardDescription>
        </CardHeader>
        <CardFooter className='gap-3 max-sm:flex-col max-sm:items-stretch'>
          <Button size='sm'>Launch Playground</Button>
          <Button size='sm' variant={'outline'}>Browse Prompts</Button>
        </CardFooter>
      </Card>
      <Card className='overflow-hidden pt-0'>
        <CardContent className='px-0'>
          <img
            src='/hero-img.jpg'
            alt='Live Mermaid editor'
            className='aspect-video w-92 object-cover'
          />
        </CardContent>
        <CardHeader>
          <CardTitle>Live Preview & Smart Editing</CardTitle>
          <CardDescription>
            Edit Mermaid code side-by-side with an always-on preview, complete with pan-and-zoom controls, dark theme
            styling, and instant error feedback.
          </CardDescription>
        </CardHeader>
        <CardFooter className='gap-3 max-sm:flex-col max-sm:items-stretch'>
          <Button size='sm'>Open Editor</Button>
          <Button size='sm' variant={'outline'}>See Shortcuts</Button>
        </CardFooter>
      </Card>
      <Card className='overflow-hidden pt-0'>
        <CardContent className='px-0'>
          <img
            src='/hero-img.jpg'
            alt='Live Mermaid editor'
            className='aspect-video w-92 object-cover'
          />
        </CardContent>
        <CardHeader>
          <CardTitle>Share-Ready Outputs</CardTitle>
          <CardDescription>
            Export polished diagrams as SVG or PNG, copy Mermaid code to teammates, and embed visuals into docs with
            brand-consistent theming.
          </CardDescription>
        </CardHeader>
        <CardFooter className='gap-3 max-sm:flex-col max-sm:items-stretch'>
          <Button size='sm'>Export Options</Button>
          <Button size='sm' variant={'outline'}>Copy Mermaid</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default FeaturesCard
